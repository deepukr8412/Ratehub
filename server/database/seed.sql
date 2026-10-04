-- Demo Users
INSERT INTO users (id, name, email, role, firebase_uid) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Super', 'admin@ratehub.local', 'ADMIN', 'firebase_admin_uid'),
('22222222-2222-2222-2222-222222222222', 'Owner Bob', 'bob@ratehub.local', 'STORE_OWNER', 'firebase_bob_uid'),
('33333333-3333-3333-3333-333333333333', 'Owner Alice', 'alice@ratehub.local', 'STORE_OWNER', 'firebase_alice_uid'),
('44444444-4444-4444-4444-444444444444', 'Normal User 1', 'user1@ratehub.local', 'USER', 'firebase_user1_uid'),
('55555555-5555-5555-5555-555555555555', 'Normal User 2', 'user2@ratehub.local', 'USER', 'firebase_user2_uid')
ON CONFLICT (email) DO NOTHING;

-- Demo Stores
INSERT INTO stores (id, name, email, address, owner_id) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Bob''s Burgers', 'contact@bobsburgers.com', '123 Ocean Avenue', '22222222-2222-2222-2222-222222222222'),
('bbbb2222-2222-2222-2222-222222222222', 'Alice''s Restaurant', 'info@alices.com', '456 Main St, Mass', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Demo Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
('44444444-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', 5),
('55555555-5555-5555-5555-555555555555', 'aaaa1111-1111-1111-1111-111111111111', 4),
('44444444-4444-4444-4444-444444444444', 'bbbb2222-2222-2222-2222-222222222222', 3)
ON CONFLICT (user_id, store_id) DO NOTHING;
