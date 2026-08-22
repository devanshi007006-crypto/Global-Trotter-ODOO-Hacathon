# -*- coding: utf-8 -*-
from odoo import models, fields, api, _

class GlobalTrotterActivityVote(models.Model):
    _name = 'gt.activity.vote'
    _description = 'GlobalTrotter Activity Collaboration Vote'
    _rec_name = 'activity_id'

    activity_id = fields.Many2one('gt.activity', string='Activity', required=True, ondelete='cascade')
    partner_id = fields.Many2one('res.partner', string='Traveler', required=True, default=lambda self: self.env.user.partner_id)
    vote_value = fields.Integer(string='Vote', default=1, help='+1 for Upvote, -1 for Downvote')
    
    _sql_constraints = [
        ('unique_partner_activity_vote', 'unique(activity_id, partner_id)', 'A traveler can only vote once per activity!')
    ]
