CREATE TABLE IF NOT EXISTS public.shipment_bls (
  id INT8 NOT NULL DEFAULT unique_rowid(),
  shipment_id STRING NULL,
  master_bl STRING NULL,
  house_bl STRING NULL,
  loading_port STRING NULL,
  vessel STRING NULL,
  etd TIMESTAMP NULL,
  eta TIMESTAMP NULL,
  delivery_agent STRING NULL,
  created_at TIMESTAMP NULL DEFAULT current_timestamp():::TIMESTAMP,
  CONSTRAINT shipment_bls_pkey PRIMARY KEY (id ASC),
  CONSTRAINT shipment_bls_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE
);
