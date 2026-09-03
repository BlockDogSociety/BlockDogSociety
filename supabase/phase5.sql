-- Phase 5: enforce photo type/size at the storage layer, not just the
-- client — this is the real enforcement point since uploads go straight
-- from the browser to Supabase Storage, bypassing our server.
-- Run this in the SQL Editor.

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png']
where id = 'dog-photos';
