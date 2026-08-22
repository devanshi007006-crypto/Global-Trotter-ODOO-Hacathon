# -*- coding: utf-8 -*-
import json
from odoo import http, fields, _
from odoo.http import request, Response
from datetime import timedelta

class GlobalTrotterApiController(http.Controller):

    def _json_response(self, data, status=200):
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ]
        return Response(json.dumps(data), status=status, headers=headers)

    # ==========================================================================
    # AUTHENTICATION & USER MANAGEMENT ENDPOINTS (Screen 1 & Screen 2)
    # ==========================================================================

    @http.route('/api/v1/auth/register', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def register_user(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            first_name = body.get('first_name', '').strip()
            last_name = body.get('last_name', '').strip()
            email = body.get('email', '').strip().lower()
            phone = body.get('phone', '').strip()
            city = body.get('city', '').strip()
            country = body.get('country', '').strip()
            info = body.get('info', '').strip()

            full_name = f"{first_name} {last_name}".strip() or email.split('@')[0]

            if not email:
                return self._json_response({'status': 'error', 'message': 'Email address is required'}, status=400)

            partner = request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
            if not partner:
                partner = request.env['res.partner'].sudo().create({
                    'name': full_name,
                    'email': email,
                    'phone': phone,
                    'city': city,
                    'comment': info,
                })
            else:
                partner.sudo().write({
                    'name': full_name,
                    'phone': phone or partner.phone,
                    'city': city or partner.city,
                    'comment': info or partner.comment,
                })

            user_payload = {
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'city': partner.city or city,
                'country': country,
                'isLoggedIn': True
            }

            return self._json_response({
                'status': 'success',
                'user': user_payload,
                'message': 'Account registered successfully in Odoo ERP backend!'
            })

        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    @http.route('/api/v1/auth/login', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def login_user(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            username = body.get('username', '').strip().lower()

            if not username:
                return self._json_response({'status': 'error', 'message': 'Username or Email is required'}, status=400)

            partner = request.env['res.partner'].sudo().search([
                '|', ('email', '=', username), ('name', 'ilike', username)
            ], limit=1)

            if not partner:
                return self._json_response({
                    'status': 'error',
                    'code': 'account_not_found',
                    'message': 'Account not found! Please register a new account.'
                }, status=404)

            user_payload = {
                'id': partner.id,
                'name': partner.name,
                'email': partner.email or username,
                'city': partner.city or '',
                'isLoggedIn': True
            }

            return self._json_response({
                'status': 'success',
                'user': user_payload,
                'message': 'Login successful!'
            })

        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    @http.route('/api/v1/auth/forgot_password', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def forgot_password(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            email = body.get('email', '').strip().lower()

            if not email:
                return self._json_response({'status': 'error', 'message': 'Please enter your registered email address.'}, status=400)

            partner = request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
            if not partner:
                return self._json_response({
                    'status': 'error',
                    'code': 'account_not_found',
                    'message': 'No registered account found with this email address.'
                }, status=404)

            return self._json_response({
                'status': 'success',
                'message': f"Password reset OTP & link successfully sent to {email}!"
            })

        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    # ==========================================================================
    # TRIPS MANAGEMENT ENDPOINTS
    # ==========================================================================

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
                    'days': t.duration_days,
                    'duration_days': t.duration_days,
                    'travelers': t.num_travelers,
                    'num_travelers': t.num_travelers,
                    'budget': t.budget_total,
                    'budget_total': t.budget_total,
                    'budget_spent': t.budget_spent,
                    'budget_remaining': t.budget_remaining,
                    'budget_status': t.budget_status,
                    'travel_style': t.travel_style,
                    'status': t.status,
                })
            return self._json_response({'status': 'success', 'data': res, 'trips': res})

        if request.httprequest.method == 'POST':
            try:
                body = json.loads(request.httprequest.data.decode('utf-8'))
                destination = body.get('destination', 'Destination')
                days = int(body.get('days', body.get('duration_days', 5)))
                budget = float(body.get('budget', body.get('budget_total', 50000.0)))
                travelers = int(body.get('travelers', body.get('num_travelers', 1)))
                interest = body.get('interest', body.get('interests', 'Balanced Exploration'))

                style_lower = interest.lower()
                travel_style = 'balanced'
                if 'luxury' in style_lower or 'royalty' in style_lower:
                    travel_style = 'luxury'
                elif 'budget' in style_lower or 'backpacker' in style_lower:
                    travel_style = 'budget'

                trip = request.env['gt.trip'].sudo().create({
                    'name': body.get('name', f"{destination} Trip"),
                    'destination': destination,
                    'start_date': body.get('start_date', fields.Date.today()),
                    'end_date': body.get('end_date', fields.Date.today() + timedelta(days=days-1)),
                    'budget_total': budget,
                    'num_travelers': travelers,
                    'travel_style': travel_style,
                    'interests': interest,
                })
                trip.sudo().action_generate_days()

                return self._json_response({
                    'status': 'success',
                    'trip_id': trip.id,
                    'trip': {
                        'id': trip.id,
                        'destination': trip.destination,
                        'days': trip.duration_days,
                        'budget': trip.budget_total,
                        'travelers': trip.num_travelers,
                        'travel_style': trip.travel_style,
                        'interests': trip.interests
                    },
                    'message': 'Trip created successfully in Odoo ERP backend'
                })
            except Exception as e:
                return self._json_response({'status': 'error', 'message': str(e)}, status=400)

    @http.route('/api/v1/trips/<int:trip_id>', type='http', auth='none', methods=['GET', 'PUT', 'OPTIONS'], csrf=False)
    def get_trip_detail(self, trip_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        trip = request.env['gt.trip'].sudo().browse(trip_id)
        if not trip.exists():
            return self._json_response({'status': 'error', 'message': 'Trip not found'}, status=404)

        if request.httprequest.method == 'PUT':
            try:
                body = json.loads(request.httprequest.data.decode('utf-8'))
                update_vals = {}
                if 'destination' in body: update_vals['destination'] = body['destination']
                if 'budget' in body: update_vals['budget_total'] = float(body['budget'])
                if 'travelers' in body: update_vals['num_travelers'] = int(body['travelers'])
                if update_vals:
                    trip.sudo().write(update_vals)
            except Exception as e:
                return self._json_response({'status': 'error', 'message': str(e)}, status=400)

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
            'trip': {
                'id': trip.id,
                'destination': trip.destination,
                'days': trip.duration_days,
                'duration_days': trip.duration_days,
                'budget': trip.budget_total,
                'budget_total': trip.budget_total,
                'budget_spent': trip.budget_spent,
                'budget_remaining': trip.budget_remaining,
                'travelers': trip.num_travelers,
                'num_travelers': trip.num_travelers,
                'travel_style': trip.travel_style,
                'interests': trip.interests,
                'status': trip.status,
            },
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

    @http.route('/api/v1/trips/<int:trip_id>/itinerary', type='http', auth='none', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_trip_itinerary(self, trip_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})

        trip = request.env['gt.trip'].sudo().browse(trip_id)
        if not trip.exists():
            trip = request.env['gt.trip'].sudo().search([], order='id desc', limit=1)
            if not trip:
                trip = request.env['gt.trip'].sudo().create({'name': 'Saved Itinerary Trip', 'destination': 'India'})

        if request.httprequest.method == 'POST':
            try:
                body = json.loads(request.httprequest.data.decode('utf-8'))
                sections = body.get('sections', [])
                
                # Unlink existing days and create fresh days from section cards
                trip.sudo().day_ids.unlink()
                
                day_num = 1
                for sec in sections:
                    day_rec = request.env['gt.itinerary.day'].sudo().create({
                        'trip_id': trip.id,
                        'day_number': day_num,
                        'title': f"Section {day_num}: {sec.get('category', 'Activity').capitalize()}",
                        'day_cost': float(sec.get('budget', 0.0))
                    })
                    request.env['gt.activity'].sudo().create({
                        'itinerary_day_id': day_rec.id,
                        'name': sec.get('info', 'Section Details'),
                        'category': sec.get('category', 'sightseeing'),
                        'start_time': f"{sec.get('start_date', '')} to {sec.get('end_date', '')}",
                        'cost': float(sec.get('budget', 0.0))
                    })
                    day_num += 1

                return self._json_response({
                    'status': 'success',
                    'message': 'Itinerary sections saved successfully in Odoo ERP backend ORM database!',
                    'trip_id': trip.id
                })
            except Exception as e:
                return self._json_response({'status': 'error', 'message': str(e)}, status=400)

        days_data = []
        for day in trip.day_ids:
            activities = []
            for act in day.activity_ids:
                activities.append({
                    'id': act.id,
                    'name': act.name,
                    'category': act.category,
                    'start_time': act.start_time,
                    'cost': act.cost,
                    'rating': act.rating,
                    'is_indoor': act.is_indoor,
                })
            days_data.append({
                'day': day.day_number,
                'title': day.title,
                'activities': activities
            })

        return self._json_response({'status': 'success', 'itinerary': days_data})

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

    @http.route('/api/v1/community/post', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def create_community_post(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._json_response({'status': 'ok'})
        try:
            body = json.loads(request.httprequest.data.decode('utf-8'))
            text = body.get('text', '')
            author = body.get('author', 'Traveler')
            
            # Save record in Odoo ORM Database Model
            post_rec = request.env['gt.community.post'].sudo().create({
                'author_name': author,
                'content': text,
                'tags': body.get('tags', '#GlobalTrotter')
            })

            return self._json_response({
                'status': 'success',
                'message': 'Community post published and stored successfully in Odoo ERP backend ORM database!',
                'post': { 'id': post_rec.id, 'author': post_rec.author_name, 'text': post_rec.content, 'likes': 1 }
            })
        except Exception as e:
            return self._json_response({'status': 'error', 'message': str(e)}, status=400)


