from django.http import JsonResponse
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from django.views.decorators.csrf import csrf_exempt

DB_URL = "postgresql://postgres.kwmunuxdjauewbgekppt:hJ9xGs3Q4ViCUJuD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

def get_artists(request):
    if request.method == 'GET':
        try:
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("SELECT * FROM ARTIST ORDER BY name ASC;")
            artists = cursor.fetchall()
            
            cursor.close()
            conn.close()

            return JsonResponse(artists, safe=False)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_artist(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO ARTIST (name, genre) VALUES (%s, %s);", 
                (data['name'], data.get('genre', ''))
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Artist created successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def update_artist(request, artist_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()
            
            cursor.execute(
                "UPDATE ARTIST SET name = %s, genre = %s WHERE artist_id = %s;", 
                (data['name'], data.get('genre', ''), str(artist_id))
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Artist updated successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def delete_artist(request, artist_id):
    if request.method == 'DELETE':
        try:
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()
            
            cursor.execute("DELETE FROM ARTIST WHERE artist_id = %s;", (str(artist_id),))
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Artist deleted successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

def get_ticket_categories(request):
    if request.method == 'GET':
        try:
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            query = """
                SELECT tc.*, e.event_title 
                FROM ticket_category tc
                JOIN event e ON tc.tevent_id = e.event_id
                ORDER BY e.event_title ASC, tc.category_name ASC;
            """
            cursor.execute(query) 
            categories = cursor.fetchall()
            
            cursor.close()
            conn.close()
            return JsonResponse(categories, safe=False)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def add_ticket_category(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()
            
            cursor.execute(
                "INSERT INTO TICKET_CATEGORY (category_name, quota, price, tevent_id) VALUES (%s, %s, %s, %s);",
                (data['category_name'], data['quota'], data['price'], data['tevent_id'])
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Category created successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def update_ticket_category(request, category_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()
            
            cursor.execute(
                "UPDATE TICKET_CATEGORY SET category_name = %s, quota = %s, price = %s WHERE category_id = %s;",
                (data['category_name'], data['quota'], data['price'], str(category_id))
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Category updated successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def delete_ticket_category(request, category_id):
    if request.method == 'DELETE':
        try:
            conn = psycopg2.connect(DB_URL)
            cursor = conn.cursor()
            
            cursor.execute("DELETE FROM TICKET_CATEGORY WHERE category_id = %s;", (str(category_id),))
            conn.commit()
            
            cursor.close()
            conn.close()
            return JsonResponse({"message": "Category deleted successfully!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)