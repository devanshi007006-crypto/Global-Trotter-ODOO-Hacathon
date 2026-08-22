# -*- coding: utf-8 -*-
from odoo import models, fields

class GtCommunityPost(models.Model):
    _name = 'gt.community.post'
    _description = 'GlobalTrotter Community Post Record'
    _order = 'create_date desc'

    author_name = fields.Char(string='Author Name', required=True, default='Traveler')
    author_email = fields.Char(string='Author Email')
    content = fields.Text(string='Post Content', required=True)
    tags = fields.Char(string='Tags / Hashtags', default='#GlobalTrotter')
    likes_count = fields.Integer(string='Upvotes Count', default=1)
    comments_count = fields.Integer(string='Comments Count', default=0)
    post_date = fields.Datetime(string='Post Date', default=fields.Datetime.now)
