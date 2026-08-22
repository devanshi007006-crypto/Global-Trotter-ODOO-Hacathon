# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class GlobalTrotterExpense(models.Model):
    _name = 'gt.expense'
    _description = 'GlobalTrotter Expense'
    _order = 'date desc, id desc'

    trip_id = fields.Many2one('gt.trip', string='Trip', required=True, ondelete='cascade')
    name = fields.Char(string='Expense Description', required=True)
    paid_by_id = fields.Many2one('res.partner', string='Paid By', required=True, default=lambda self: self.env.user.partner_id)
    
    category = fields.Selection([
        ('flights', '✈️ Flights & Airfare'),
        ('hotels', '🏨 Accommodation & Hotels'),
        ('food', '🍕 Food & Dining'),
        ('transit', '🚗 Transportation & Taxi'),
        ('activities', '🎟️ Tickets & Activities'),
        ('shopping', '🛍️ Shopping'),
        ('misc', '📦 Miscellaneous')
    ], string='Category', default='food', required=True)

    currency_id = fields.Many2one('res.currency', related='trip_id.currency_id', store=True)
    amount = fields.Monetary(string='Amount Paid', currency_field='currency_id', required=True, default=0.0)
    date = fields.Date(string='Date', default=fields.Date.today, required=True)
    
    split_type = fields.Selection([
        ('equal', 'Split Equally Among All Travelers'),
        ('custom', 'Custom Split Amounts')
    ], string='Split Type', default='equal', required=True)

    split_line_ids = fields.One2many('gt.expense.split', 'expense_id', string='Expense Splits', copy=True)
    notes = fields.Text(string='Notes / Receipt Ref')

    @api.model_create_multi
    def create(self, vals_list):
        records = super(GlobalTrotterExpense, self).create(vals_list)
        for rec in records:
            if rec.split_type == 'equal' and rec.trip_id and not rec.split_line_ids:
                rec._generate_equal_splits()
        return records

    def write(self, vals):
        res = super(GlobalTrotterExpense, self).write(vals)
        for rec in self:
            if 'amount' in vals or 'split_type' in vals:
                if rec.split_type == 'equal':
                    rec._generate_equal_splits()
        return res

    def _generate_equal_splits(self):
        """ Automatically divides amount equally across all trip travelers """
        self.ensure_one()
        self.split_line_ids.unlink()
        travelers = self.trip_id.traveler_ids or self.env['res.partner'].search([('id', '=', self.paid_by_id.id)])
        if not travelers:
            travelers = self.env.user.partner_id

        count = len(travelers)
        if count > 0:
            per_person = round(self.amount / count, 2)
            split_vals = []
            for t in travelers:
                split_vals.append({
                    'expense_id': self.id,
                    'partner_id': t.id,
                    'share_amount': per_person,
                })
            self.env['gt.expense.split'].create(split_vals)


class GlobalTrotterExpenseSplit(models.Model):
    _name = 'gt.expense.split'
    _description = 'GlobalTrotter Expense Share Detail'

    expense_id = fields.Many2one('gt.expense', string='Expense', required=True, ondelete='cascade')
    partner_id = fields.Many2one('res.partner', string='Traveler', required=True)
    currency_id = fields.Many2one('res.currency', related='expense_id.currency_id', store=True)
    share_amount = fields.Monetary(string='Share Amount', currency_field='currency_id', required=True, default=0.0)
    is_settled = fields.Boolean(string='Settled / Paid', default=False)


# Extend gt.trip to compute group debt balances ("Who owes whom")
class GlobalTrotterTripDebt(models.Model):
    _inherit = 'gt.trip'

    debt_summary = fields.Text(string='Expense Debt Settlement Summary', compute='_compute_debt_settlements')

    @api.depends('expense_ids.amount', 'expense_ids.paid_by_id', 'expense_ids.split_line_ids.share_amount')
    def _compute_debt_settlements(self):
        for trip in self:
            if not trip.expense_ids:
                trip.debt_summary = _("No group expenses recorded yet.")
                continue

            # Calculate balance per partner: Net = Paid - Owed Share
            balances = {}
            # Initialize partners
            for partner in trip.traveler_ids:
                balances[partner.id] = {'name': partner.name, 'net': 0.0}

            for expense in trip.expense_ids:
                payer_id = expense.paid_by_id.id
                if payer_id not in balances:
                    balances[payer_id] = {'name': expense.paid_by_id.name, 'net': 0.0}
                balances[payer_id]['net'] += expense.amount

                for split in expense.split_line_ids:
                    p_id = split.partner_id.id
                    if p_id not in balances:
                        balances[p_id] = {'name': split.partner_id.name, 'net': 0.0}
                    balances[p_id]['net'] -= split.share_amount

            debtors = []   # Net < 0 (Owes money)
            creditors = [] # Net > 0 (Is owed money)

            for pid, data in balances.items():
                net = round(data['net'], 2)
                if net < -0.01:
                    debtors.append({'id': pid, 'name': data['name'], 'amount': -net})
                elif net > 0.01:
                    creditors.append({'id': pid, 'name': data['name'], 'amount': net})

            settlements = []
            d_idx, c_idx = 0, 0

            while d_idx < len(debtors) and c_idx < len(creditors):
                debtor = debtors[d_idx]
                creditor = creditors[c_idx]
                payment = min(debtor['amount'], creditor['amount'])

                settlements.append(
                    _("💸 %s pays %s ➡️ %s %s") % (
                        debtor['name'],
                        f"{trip.currency_id.symbol or '₹'}{payment:,.2f}",
                        creditor['name'],
                        ""
                    )
                )

                debtor['amount'] -= payment
                creditor['amount'] -= payment

                if debtor['amount'] < 0.01:
                    d_idx += 1
                if creditor['amount'] < 0.01:
                    c_idx += 1

            if settlements:
                trip.debt_summary = "\n".join(settlements)
            else:
                trip.debt_summary = _("All group expenses are completely balanced!")
