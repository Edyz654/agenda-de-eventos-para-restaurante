INSERT INTO users (name, email, phone_number) VALUES
('Carlos Dias', 'carlosdias@example.com', '5595555555'),
('Maria Pereira', 'mariapereira@example.com', '5594444444');

INSERT INTO customers (name, phone_number, email, cpf, address) VALUES
('Carlos Cliente', '555989988', 'carlos@cliente.com', '01234567800', 'Rua Das Rosas, 178, São Paulo, SP'),
('Maria Cliente', '555979797', 'maria@cliente.com', '12345678900', 'Rua Das Pedras, 177, Rio De Janeiro, RJ');

INSERT INTO spaces (name) VALUES
('cave'),
('restaurante'),
('restaurante_interno'),
('deck'),
('pergolado'),
('jardim');

INSERT INTO events 
(user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status) VALUES 
(2, 3, 1,'Congresso de medicina do trabalho', 'Palestras e coffee breaks', '2026-10-14', '2026-10-14 10:00:00', 'buffet', 'confirmado'),
(1, 5, 2,'Encontro de motociclistas', 'Confraternização', '2026-08-02', '2026-08-02 20:00:00', 'buffet', 'confirmado');
