CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone_number VARCHAR(20),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spaces (
	id INT AUTO_INCREMENT PRIMARY KEY,
	event_location ENUM(
	'cave', 
	'restaurante', 
	'restaurante_interno', 
	'deck', 
	'pergolado', 
	'jardim',
	'pendente'
	) NOT NULL DEFAULT 'pendente',
	
	setup_type ENUM(
	'buffet', 
	'coquetel', 
	'a_la_carte', 
	'reuniao', 
	'auditorio',
	'pendente'
	) NOT NULL DEFAULT 'pendente',
	
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE customers (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	phone_number VARCHAR(20) NOT NULL,
	email VARCHAR(250) UNIQUE,
	cpf VARCHAR(15) UNIQUE,
	address VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	
);

CREATE TABLE events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	space_id INT NOT NULL,
	customer_id INT NOT NULL,
	event_name VARCHAR(100) NOT NULL,
	event_description TEXT,
	event_date DATE NOT NULL,
	event_start TIMESTAMP,
	event_status ENUM(
	'confirmado', 
	'nao_confirmado'
	) NOT NULL DEFAULT 'nao_confirmado',
	uploads_url VARCHAR(250),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	CONSTRAINT fk_events_user
		FOREIGN KEY(user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_events_space
		FOREIGN KEY(space_id)
		REFERENCES spaces(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_events_customer
		FOREIGN KEY(customer_id)
		REFERENCES customers(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
	);