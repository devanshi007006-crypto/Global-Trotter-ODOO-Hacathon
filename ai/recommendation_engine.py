#!/usr/bin/env python3
"""
GlobalTrotter AI Recommendation & Itinerary Engine
--------------------------------------------------
Designed for Member 3 (AI Lead).
Integrates LLM / Rule-based Trip Generator with Odoo Backend API gateway.
"""

import json
import requests
import sys

ODOO_API_BASE_URL = "http://localhost:8069/api/v1"

class GlobalTrotterAI:
    def __init__(self, odoo_url=ODOO_API_BASE_URL):
        self.odoo_url = odoo_url

    def generate_smart_itinerary(self, destination, duration_days, budget, num_travelers, travel_style, interests):
        """
        AI Itinerary Generation Logic
        Can call Gemini/OpenAI API or fallback to smart heuristic template.
        """
        print(f"🤖 [AI Engine] Generating {duration_days}-Day itinerary for '{destination}' (Budget: ₹{budget:,}, Style: {travel_style})...")
        
        # Sample generated day-by-day payload schema matching Odoo sync expectations
        generated_days = []
        daily_budget_target = round((budget * 0.4) / duration_days, 2) # Allocate 40% for activities/food

        for day in range(1, duration_days + 1):
            day_payload = {
                "day_number": day,
                "title": f"Day {day} - Exploring {destination} Highlights",
                "activities": [
                    {
                        "name": f"Morning Tour in {destination} (Landmarks & Culture)",
                        "category": "sightseeing",
                        "start_time": "09:00 AM",
                        "duration_hours": 3.0,
                        "cost": round(daily_budget_target * 0.4, 2),
                        "is_indoor": False,
                        "location": f"Central District, {destination}"
                    },
                    {
                        "name": f"Local Gourmet Lunch ({interests.split(',')[0] if interests else 'Local Cuisine'})",
                        "category": "food",
                        "start_time": "12:30 PM",
                        "duration_hours": 1.5,
                        "cost": round(daily_budget_target * 0.25, 2),
                        "is_indoor": True,
                        "location": f"Old Town, {destination}"
                    },
                    {
                        "name": f"Afternoon Museum & Exhibition",
                        "category": "sightseeing",
                        "start_time": "03:00 PM",
                        "duration_hours": 2.5,
                        "cost": round(daily_budget_target * 0.35, 2),
                        "is_indoor": True,
                        "location": f"Art Museum, {destination}"
                    }
                ]
            }
            generated_days.append(day_payload)

        return generated_days

    def sync_with_odoo(self, trip_id, generated_days):
        """ Syncs AI-generated itinerary with Odoo trip record """
        target_url = f"{self.odoo_url}/trips/{trip_id}/ai_sync"
        payload = {"days": generated_days}
        
        try:
            response = requests.post(target_url, json=payload, timeout=10)
            if response.status_code == 200:
                print(f"✅ [AI Engine] Successfully synced itinerary with Odoo Trip #{trip_id}!")
                return response.json()
            else:
                print(f"⚠️ [AI Engine] Odoo sync responded with status {response.status_code}: {response.text}")
                return None
        except requests.exceptions.ConnectionError:
            print(f"ℹ️ [AI Engine Simulator] Odoo server offline at {self.odoo_url}. Dumping JSON payload preview:\n")
            print(json.dumps(payload, indent=2))
            return payload

if __name__ == '__main__':
    ai = GlobalTrotterAI()
    sample_days = ai.generate_smart_itinerary(
        destination="Tokyo",
        duration_days=5,
        budget=80000,
        num_travelers=2,
        travel_style="balanced",
        interests="Food, Culture, Shopping"
    )
    ai.sync_with_odoo(trip_id=1, generated_days=sample_days)
