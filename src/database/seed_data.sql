-- SEEDS DE CLIENTES

INSERT INTO customers (name,phone_number,email,cpf,address,created_at,updated_at) 
VALUES ('Carlos Cliente','555989988','carlos@cliente.com','01234567800','Rua Das Rosas, 178, São Paulo, SP','2026-05-19 23:22:37','2026-05-19 23:22:37');

INSERT INTO customers (name,phone_number,email,cpf,address,created_at,updated_at) 
VALUES ('Maria Cliente','555979797','maria@cliente.com','12345678900','Rua Das Pedras, 177, Rio De Janeiro, RJ','2026-05-19 23:22:37','2026-05-19 23:22:37');

-- SEEDS DE ESPAÇOS

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('cave','2026-05-26 18:53:24','2026-05-26 18:53:24');

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('restaurante','2026-05-26 18:53:24','2026-05-26 18:53:24');

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('restaurante_interno','2026-05-26 18:53:24','2026-05-26 18:53:24');

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('deck','2026-05-26 18:53:24','2026-05-26 18:53:24');

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('pergolado','2026-05-26 18:53:24','2026-05-26 18:53:24');

INSERT INTO spaces (name,created_at,updated_at) 
VALUES ('jardim','2026-05-26 18:53:24','2026-05-26 18:53:24');


-- SEEDS DE USUÁRIOS
INSERT INTO users (name,email,phone_number,created_at,password,`role`) VALUES ('Carlos Dias','carlosdias@example.com','5595555555','2026-05-18 22:13:22','$2b$10$mOo.ieSKq8IRZnaGZlSeveoBO9aMEtAg3VQihd2pQsJD.42OGL/rm','user');


INSERT INTO users (name,email,phone_number,created_at,password,`role`) VALUES ('Administrador API','admin@agenda.com','11999999999','2026-06-15 19:39:41','$2b$10$30QaZ9XAFYMCH891wnhAvOdSSyTfSlIkWsDE755QniZm3A0GkCRB6','admin');

INSERT INTO users (name,email,phone_number,created_at,password,`role`) VALUES ('Usuario 2','usuario2@example.com','1111111111','2026-06-23 16:34:35','$2b$10$SYL7sV80Uz.stHJ/YB1QOerlSIDhw6LdK6WGQkGx66ytAqZfkUdAe','user');

-- SEEDS DE EVENTOS

INSERT INTO events (user_id,space_id,customer_id,event_name,event_description,event_date,event_start,seats_count,setup_type,event_status,uploads_url,created_at,updated_at) 
VALUES (2,3,1,'Congresso de medicina do trabalho','Palestras e coffee breaks','2026-10-14','2026-10-14 10:00:00',NULL,'buffet','confirmado',NULL,'2026-05-26 20:17:34','2026-05-26 20:17:34');

INSERT INTO events (user_id,space_id,customer_id,event_name,event_description,event_date,event_start,seats_count,setup_type,event_status,uploads_url,created_at,updated_at) 
VALUES (1,5,2,'Encontro de motociclistas','Confraternização','2026-08-02','2026-08-02 20:00:00',NULL,'buffet','confirmado',NULL,'2026-05-26 20:19:55','2026-05-26 20:19:55');

INSERT INTO events (user_id,space_id,customer_id,event_name,event_description,event_date,event_start,seats_count,setup_type,event_status,uploads_url,created_at,updated_at) 
VALUES (1,1,1,'Evento Admin','Criado por admin','2026-07-02','2026-07-02 10:00:00',50,'buffet','confirmado',NULL,'2026-06-23 16:37:27','2026-06-23 16:37:27');
