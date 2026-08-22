# -*- coding: utf-8 -*-
from odoo import models, fields, api, _

class GlobalTrotterItineraryDay(models.Model):
    _name = 'gt.itinerary.day'
    _description = 'GlobalTrotter Day-wise Itinerary'
    _order = 'trip_id, day_number asc'

    trip_id = fields.Many2one('gt.trip', string='Trip', required=True, ondelete='cascade')
    day_number = fields.Integer(string='Day #', required=True, default=1)
    date = fields.Date(string='Date')
    title = fields.Char(string='Day Title / Theme', required=True, default=lambda self: _('Exploration Day'))
    
    activity_ids = fields.One2many('gt.activity', 'itinerary_day_id', string='Activities', copy=True)
    currency_id = fields.Many2one('res.currency', related='trip_id.currency_id', store=True)
    day_cost = fields.Monetary(string='Daily Cost Total', currency_field='currency_id', compute='_compute_day_cost', store=True)
    
    notes = fields.Text(string='Day Notes & Tips')

    @api.depends('activity_ids.cost')
    def _compute_day_cost(self):
        for day in self:
            day.day_cost = sum(activity.cost for activity in day.activity_ids)


class GlobalTrotterActivity(models.Model):
    _name = 'gt.activity'
    _description = 'GlobalTrotter Activity'
    _order = 'itinerary_day_id, start_time asc, id asc'

    itinerary_day_id = fields.Many2one('gt.itinerary.day', string='Itinerary Day', required=True, ondelete='cascade')
    trip_id = fields.Many2one('gt.trip', string='Trip', related='itinerary_day_id.trip_id', store=True, readonly=True)
    
    name = fields.Char(string='Activity Name', required=True)
    category = fields.Selection([
        ('sightseeing', '🏛️ Sightseeing & History'),
        ('food', '🍕 Food & Dining'),
        ('adventure', '🏄 Adventure & Outdoors'),
        ('transit', '✈️ Flights & Transit'),
        ('shopping', '🛍️ Shopping'),
        ('stay', '🏨 Hotel & Stay'),
        ('other', '📌 Other')
    ], string='Category', default='sightseeing', required=True)

    start_time = fields.Char(string='Start Time', default='09:00 AM', help='e.g., 09:00 AM, 02:30 PM')
    duration_hours = fields.Float(string='Duration (Hrs)', default=2.0)
    
    currency_id = fields.Many2one('res.currency', related='trip_id.currency_id', store=True)
    cost = fields.Monetary(string='Estimated Cost', currency_field='currency_id', default=0.0)
    
    rating = fields.Float(string='Rating (0-5)', default=4.5)
    is_indoor = fields.Boolean(string='Indoor Activity', default=False, help='Used by AI weather & rain optimizer')
    location = fields.Char(string='Location / Address')
    notes = fields.Text(string='Description / Booking Details')

    vote_ids = fields.One2many('gt.activity.vote', 'activity_id', string='Traveler Votes')
    vote_score = fields.Integer(string='Vote Score', compute='_compute_vote_score', store=True)

    @api.depends('vote_ids.vote_value')
    def _compute_vote_score(self):
        for act in self:
            act.vote_score = sum(v.vote_value for v in act.vote_ids)

    def action_vote_up(self):
        """ Vote +1 for current user """
        self.ensure_one()
        current_partner = self.env.user.partner_id
        vote = self.env['gt.activity.vote'].search([
            ('activity_id', '=', self.id),
            ('partner_id', '=', current_partner.id)
        ], limit=1)
        if vote:
            vote.vote_value = 1
        else:
            self.env['gt.activity.vote'].create({
                'activity_id': self.id,
                'partner_id': current_partner.id,
                'vote_value': 1
            })
        return True

    def action_vote_down(self):
        """ Vote -1 for current user """
        self.ensure_one()
        current_partner = self.env.user.partner_id
        vote = self.env['gt.activity.vote'].search([
            ('activity_id', '=', self.id),
            ('partner_id', '=', current_partner.id)
        ], limit=1)
        if vote:
            vote.vote_value = -1
        else:
            self.env['gt.activity.vote'].create({
                'activity_id': self.id,
                'partner_id': current_partner.id,
                'vote_value': -1
            })
        return True
