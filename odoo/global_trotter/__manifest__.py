# -*- coding: utf-8 -*-
{
    'name': 'GlobalTrotter - Smart Travel & Trip Management',
    'version': '1.0.0',
    'category': 'Services/Travel',
    'summary': 'AI-Powered Collaborative Travel & Trip Management Platform on Odoo ERP',
    'description': """
GlobalTrotter Smart Trip Management System
==========================================
Transform travel planning into a unified workspace on Odoo:
- Smart Day-wise Itinerary Planning & Management
- Real-time Budget Tracking & Category Analytics (Flights, Hotels, Food, Activities)
- Group Trip Collaboration & Fair Expense Debt Balancer ("Who owes whom")
- "What-If?" Trip Optimizer Engine (Dynamic budget recalculation & activity adjustments)
- REST/JSON-RPC API Gateway for AI Engine & Modern Web/Mobile UI
    """,
    'author': 'GlobalTrotter Hackathon Team',
    'website': 'https://github.com/global-trotter/global-trotter',
    'depends': ['base', 'mail', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/trip_views.xml',
        'views/itinerary_views.xml',
        'views/expense_views.xml',
        'views/menu_views.xml',
        'data/demo_data.xml',
    ],
    'demo': [
        'data/demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
