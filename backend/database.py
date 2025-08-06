import sqlite3

# Connect to the database (this will create the file if it doesn't exist)
connection = sqlite3.connect('veritas.db')
cursor = connection.cursor()

# Create the reviews table
cursor.execute('''
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    reviewer_address TEXT NOT NULL,
    review_text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

print("Database and 'reviews' table created successfully.")

connection.commit()
connection.close()