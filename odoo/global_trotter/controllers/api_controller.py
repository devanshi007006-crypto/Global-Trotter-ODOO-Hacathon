# -*- coding: utf-8 -*-
import json
from odoo import http, _
from odoo.http import request, Response

class GlobalTrotterApiController(http.Controller):

    def _json_response(self, data, status=200):
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ]
        return Response(json.dumps(data), status=status, headers=headers)

    @http.route('/api/v1/trips', type='http', auth='none', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_trips(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        if request.httprequest.method == 'GET':
            trips = request.env['gt.trip'].sudo().search([])
            res = []
            for t in trips:
                res.append({
                    'id': t.id,
                    'name': t.name,
                    'destination': t.destination,
                    'start_date': str(t.start_date),
                    'end_date': str(t.end_date),
                    'duration_days': t.duration_days,
                    'num_travelers': t.num_travelers,
                    'budget_total': t.budget_total,
                    'budget_spent': t.budget_spent,
                    'budget_remaining': t.budget_remaining,
                    'budget_status': t.budget_status,
                    'travel_style': t.travel_style,
                    'status': t.status,
                })
            return self._json_response({'status': 'success', 'data': res})

        if request.httprequest.method == 'POST':
            try:
                body = json.loads(request.httprequest.data.decode('utf-8'))
                trip = request.env['gt.trip'].sudo().create({
                    'name': body.get('name', 'New Trip'),
                    'destination': body.get('destination', 'Destination'),
                    'start_date': body.get('start_date'),
                    'end_date': body.get('end_date'),
                    'budget_total': float(body.get('budget_total', 50000.0)),
                    'num_travelers': int(body.get('num_travelers', 1)),
                    'travel_style': body.get('travel_style', 'balanced'),
                    'interests': body.get('interests', ''),
                })
                trip.sudo().action_generate_days()
                return self._json_response({'status': 'success', 'trip_id': trip.id, 'message': 'Trip created successfully'})
            except Exception as e:
                return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    @http.route('/api/v1/trips/<int:trip_id>', type='http', auth='none', methods=['GET', 'OPTIONS'], csrf=False)
    def get_trip_detail(self, trip_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        trip = request.env['gt.trip'].sudo().browse(trip_id)
        if not trip.exists():
            return self._json_response({'status': 'error', 'message': 'Trip not found'}, status=404)

        days_data = []
        for day in trip.day_ids:
            activities = []
            for act in day.activity_ids:
                activities.append({
                    'id': act.id,
                    'name': act.name,
                    'category': act.category,
                    'start_time': act.start_time,
                    'duration_hours': act.duration_hours,
                    'cost': act.cost,
                    'rating': act.rating,
                    'is_indoor': act.is_indoor,
                    'location': act.location,
                    'vote_score': act.vote_score,
                })
            days_data.append({
                'id': day.id,
                'day_number': day.day_number,
                'date': str(day.date),
                'title': day.title,
                'day_cost': day.day_cost,
                'activities': activities
            })

        expenses_data = []
        for exp in trip.expense_ids:
            splits = []
            for s in exp.split_line_ids:
                splits.append({'traveler': s.partner_id.name, 'share': s.share_amount})
            expenses_data.append({
                'id': exp.id,
                'description': exp.name,
                'category': exp.category,
                'paid_by': exp.paid_by_id.name,
                'amount': exp.amount,
                'date': str(exp.date),
                'splits': splits
            })

        return self._json_response({
            'status': 'success',
            'data': {
                'id': trip.id,
                'name': trip.name,
                'destination': trip.destination,
                'start_date': str(trip.start_date),
                'end_date': str(trip.end_date),
                'duration_days': trip.duration_days,
                'num_travelers': trip.num_travelers,
                'currency': trip.currency_id.name or 'INR',
                'budget': {
                    'total': trip.budget_total,
                    'spent': trip.budget_spent,
                    'remaining': trip.budget_remaining,
                    'status': trip.budget_status,
                },
                'travel_style': trip.travel_style,
                'interests': trip.interests,
                'status': trip.status,
                'itinerary': days_data,
                'expenses': expenses_data,
                'debt_summary': trip.debt_summary
            }
        })

    @http.route('/api/v1/trips/<int:trip_id>/optimize', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def optimize_trip(self, trip_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        trip = request.env['gt.trip'].sudo().browse(trip_id)
        if not trip.exists():
            return self._json_response({'status': 'error', 'message': 'Trip not found'}, status=404)

        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            opt_type = body.get('opt_type', 'cheaper_alternatives')
            trip.sudo().action_optimize_trip(opt_type=opt_type)
            return self._json_response({
                'status': 'success',
                'message': f"Optimization '{opt_type}' applied successfully",
                'new_budget_spent': trip.budget_spent,
                'new_budget_remaining': trip.budget_remaining
            })
        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    @http.route('/api/v1/trips/<int:trip_id>/ai_sync', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def sync_ai_itinerary(self, trip_id, **kwargs):
        """ Bulk load AI-generated itinerary into Odoo itinerary & activity models """
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        trip = request.env['gt.trip'].sudo().browse(trip_id)
        if not trip.exists():
            return self._json_response({'status': 'error', 'message': 'Trip not found'}, status=404)

        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            days_payload = body.get('days', [])

            # Clear existing days to sync fresh AI itinerary
            trip.sudo().day_ids.unlink()

            for day_info in days_payload:
                day_rec = request.env['gt.itinerary.day'].sudo().create({
                    'trip_id': trip.id,
                    'day_number': day_info.get('day_number', 1),
                    'date': day_info.get('date', str(trip.start_date)),
                    'title': day_info.get('title', f"Day {day_info.get('day_number', 1)} Exploration")
                })
                for act_info in day_info.get('activities', []):
                    request.env['gt.activity'].sudo().create({
                        'itinerary_day_id': day_rec.id,
                        'name': act_info.get('name'),
                        'category': act_info.get('category', 'sightseeing'),
                        'start_time': act_info.get('start_time', '09:00 AM'),
                        'duration_hours': float(act_info.get('duration_hours', 2.0)),
                        'cost': float(act_info.get('cost', 0.0)),
                        'is_indoor': bool(act_info.get('is_indoor', False)),
                        'location': act_info.get('location', ''),
                    })
            return self._json_response({'status': 'success', 'message': 'AI Itinerary synchronized with Odoo backend.'})
        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)
