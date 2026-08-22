# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
from datetime import datetime, timedelta

class GlobalTrotterTrip(models.Model):
    _name = 'gt.trip'
    _description = 'GlobalTrotter Trip Management'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'start_date desc, id desc'

    name = fields.Char(string='Trip Name', required=True, tracking=True, default=lambda self: _('New Trip'))
    destination = fields.Char(string='Destination', required=True, tracking=True, help='e.g., Paris, France or Tokyo, Japan')
    start_date = fields.Date(string='Start Date', required=True, default=fields.Date.today, tracking=True)
    end_date = fields.Date(string='End Date', required=True, default=lambda self: fields.Date.today() + timedelta(days=4), tracking=True)
    duration_days = fields.Integer(string='Duration (Days)', compute='_compute_duration_days', store=True)
    
    num_travelers = fields.Integer(string='Number of Travelers', default=1, required=True, tracking=True)
    currency_id = fields.Many2one('res.currency', string='Currency', default=lambda self: self.env.company.currency_id, required=True)
    
    budget_total = fields.Monetary(string='Total Budget', currency_field='currency_id', required=True, tracking=True, default=50000.0)
    budget_spent = fields.Monetary(string='Spent Amount', currency_field='currency_id', compute='_compute_budget_summary', store=True)
    budget_remaining = fields.Monetary(string='Remaining Budget', currency_field='currency_id', compute='_compute_budget_summary', store=True)
    budget_status = fields.Selection([
        ('on_track', 'On Track (Good)'),
        ('warning', 'Warning (Near Limit)'),
        ('exceeded', 'Budget Exceeded!')
    ], string='Budget Health', compute='_compute_budget_summary', store=True)

    travel_style = fields.Selection([
        ('budget', 'Budget Backpacker'),
        ('balanced', 'Balanced & Comfortable'),
        ('luxury', 'Luxury & Premium')
    ], string='Travel Style', default='balanced', required=True)

    interests = fields.Char(string='Interests & Preferences', help='e.g., Food, History, Nature, Shopping, Adventure')
    
    status = fields.Selection([
        ('draft', 'Draft / Planning'),
        ('planned', 'Confirmed / Planned'),
        ('ongoing', 'Trip in Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='draft', tracking=True)

    traveler_ids = fields.Many2many('res.partner', 'gt_trip_partner_rel', 'trip_id', 'partner_id', string='Group Travelers')
    day_ids = fields.One2many('gt.itinerary.day', 'trip_id', string='Day-wise Itinerary', copy=True)
    expense_ids = fields.One2many('gt.expense', 'trip_id', string='Expenses')
    
    notes = fields.Text(string='Trip Notes & Logistics')

    @api.depends('start_date', 'end_date')
    def _compute_duration_days(self):
        for trip in self:
            if trip.start_date and trip.end_date:
                if trip.end_date < trip.start_date:
                    trip.duration_days = 0
                else:
                    delta = (trip.end_date - trip.start_date).days + 1
                    trip.duration_days = delta
            else:
                trip.duration_days = 0

    @api.depends('budget_total', 'expense_ids.amount', 'day_ids.activity_ids.cost')
    def _compute_budget_summary(self):
        for trip in self:
            # Sum expenses and itinerary activity costs
            expense_total = sum(expense.amount for expense in trip.expense_ids)
            activity_total = sum(
                sum(act.cost for act in day.activity_ids)
                for day in trip.day_ids
            )
            total_spent = expense_total + activity_total
            trip.budget_spent = total_spent
            remaining = trip.budget_total - total_spent
            trip.budget_remaining = remaining

            if trip.budget_total > 0:
                ratio = total_spent / trip.budget_total
                if ratio > 1.0:
                    trip.budget_status = 'exceeded'
                elif ratio >= 0.85:
                    trip.budget_status = 'warning'
                else:
                    trip.budget_status = 'on_track'
            else:
                trip.budget_status = 'on_track'

    @api.constrains('start_date', 'end_date')
    def _check_dates(self):
        for trip in self:
            if trip.start_date and trip.end_date and trip.end_date < trip.start_date:
                raise ValidationError(_("End Date cannot be earlier than Start Date!"))

    def action_generate_days(self):
        """ Automatically generates Day itinerary records based on start_date and duration """
        self.ensure_one()
        if not self.start_date or not self.end_date:
            raise ValidationError(_("Please specify valid Start and End dates."))

        # Clear existing unassigned days or sync
        existing_day_numbers = set(self.day_ids.mapped('day_number'))
        current_date = self.start_date
        day_num = 1

        while current_date <= self.end_date:
            if day_num not in existing_day_numbers:
                self.env['gt.itinerary.day'].create({
                    'trip_id': self.id,
                    'day_number': day_num,
                    'date': current_date,
                    'title': f"Day {day_num} - Exploration in {self.destination}"
                })
            current_date += timedelta(days=1)
            day_num += 1
        return True

    def action_optimize_trip(self, opt_type='cheaper_alternatives', target_reduction=0.15):
        """
        'What If?' Trip Optimizer Engine
        Dynamically adjusts trip parameters and recalculates costs.
        """
        self.ensure_one()
        log_messages = []

        if opt_type == 'add_day':
            new_end_date = self.end_date + timedelta(days=1)
            self.end_date = new_end_date
            self.action_generate_days()
            log_messages.append(_("Extended trip duration by 1 day. End date is now %s.") % new_end_date)

        elif opt_type == 'upgrade_flight':
            # Create or update flight expense line with premium rate (+₹15,000 / traveler)
            flight_upgrade_cost = 15000.0 * self.num_travelers
            self.env['gt.expense'].create({
                'trip_id': self.id,
                'name': _('Flight Upgrade to Premium Economy'),
                'category': 'flights',
                'amount': flight_upgrade_cost,
                'date': self.start_date,
            })
            log_messages.append(_("Upgraded flight. Added ₹%s to expenses.") % flight_upgrade_cost)

        elif opt_type == 'cheaper_alternatives':
            # Identify activities with high cost and adjust cost down by target_reduction
            adjusted_count = 0
            for day in self.day_ids:
                for act in day.activity_ids:
                    if act.cost > 2000.0:
                        original = act.cost
                        act.cost = round(original * (1.0 - target_reduction), 2)
                        adjusted_count += 1
            log_messages.append(_("Optimized %d expensive activities with budget alternatives (reduced costs by %d%%).") % (adjusted_count, int(target_reduction * 100)))

        elif opt_type == 'rain_mode':
            # Replace outdoor activities with indoor activities for rainy forecast
            swapped = 0
            for day in self.day_ids:
                for act in day.activity_ids:
                    if not act.is_indoor:
                        act.write({
                            'is_indoor': True,
                            'name': f"[Indoor Alternative] {act.name} (Museum/Exhibition)",
                            'notes': _("Swapped to indoor location due to weather forecast.")
                        })
                        swapped += 1
            log_messages.append(_("Weather Optimizer activated: Swapped %d outdoor activities to indoor experiences.") % swapped)

        # Log optimization action on Odoo chatter
        msg = "<br/>".join(log_messages)
        self.message_post(body=f"<b>🚀 'What-If?' Trip Optimization Applied:</b><br/>{msg}")
        return True
