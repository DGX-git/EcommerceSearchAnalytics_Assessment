--
-- PostgreSQL database dump
--

\restrict hAZcWsdZJxXgnYqeDnC1XU6fYLRxcXZ3KhHXD5yqRWzeOiQtSBwUwwHVsJDqeXS

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-10 19:39:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16401)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    brand_id bigint NOT NULL,
    brand_name text
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16400)
-- Name: brands_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_brand_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_brand_id_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 221
-- Name: brands_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_brand_id_seq OWNED BY public.brands.brand_id;


--
-- TOC entry 224 (class 1259 OID 16413)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    category_name text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16412)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- TOC entry 226 (class 1259 OID 16425)
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    collection_id bigint NOT NULL,
    collection_name text
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16424)
-- Name: collections_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.collections_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.collections_collection_id_seq OWNER TO postgres;

--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 225
-- Name: collections_collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.collections_collection_id_seq OWNED BY public.collections.collection_id;


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customer_id bigint NOT NULL,
    customer_email text
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customer_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 219
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- TOC entry 230 (class 1259 OID 16463)
-- Name: ip_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ip_addresses (
    id bigint NOT NULL,
    search_id text,
    ip_address text
);


ALTER TABLE public.ip_addresses OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16462)
-- Name: ip_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ip_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_addresses_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 229
-- Name: ip_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ip_addresses_id_seq OWNED BY public.ip_addresses.id;


--
-- TOC entry 231 (class 1259 OID 16477)
-- Name: search_brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_brands (
    search_id text NOT NULL,
    brand_id bigint NOT NULL
);


ALTER TABLE public.search_brands OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16496)
-- Name: search_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_categories (
    search_id text NOT NULL,
    category_id bigint NOT NULL
);


ALTER TABLE public.search_categories OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16515)
-- Name: search_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_collections (
    search_id text NOT NULL,
    collection_id bigint NOT NULL
);


ALTER TABLE public.search_collections OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16449)
-- Name: search_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_metrics (
    search_id text NOT NULL,
    min_price numeric,
    max_price numeric,
    min_rating numeric,
    total_results integer
);


ALTER TABLE public.search_metrics OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16436)
-- Name: searches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.searches (
    search_id text NOT NULL,
    customer_id bigint,
    search_keyword text,
    attributes jsonb,
    min_price numeric,
    max_price numeric,
    min_rating numeric,
    total_results integer,
    search_date timestamp with time zone
);


ALTER TABLE public.searches OWNER TO postgres;

--
-- TOC entry 4897 (class 2604 OID 16404)
-- Name: brands brand_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN brand_id SET DEFAULT nextval('public.brands_brand_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 16416)
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16428)
-- Name: collections collection_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections ALTER COLUMN collection_id SET DEFAULT nextval('public.collections_collection_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16392)
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 16466)
-- Name: ip_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_addresses ALTER COLUMN id SET DEFAULT nextval('public.ip_addresses_id_seq'::regclass);


--
-- TOC entry 4906 (class 2606 OID 16411)
-- Name: brands brands_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_brand_name_key UNIQUE (brand_name);


--
-- TOC entry 4908 (class 2606 OID 16409)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (brand_id);


--
-- TOC entry 4910 (class 2606 OID 16423)
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- TOC entry 4912 (class 2606 OID 16421)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4914 (class 2606 OID 16435)
-- Name: collections collections_collection_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_collection_name_key UNIQUE (collection_name);


--
-- TOC entry 4916 (class 2606 OID 16433)
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (collection_id);


--
-- TOC entry 4902 (class 2606 OID 16399)
-- Name: customers customers_customer_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_email_key UNIQUE (customer_email);


--
-- TOC entry 4904 (class 2606 OID 16397)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 4922 (class 2606 OID 16471)
-- Name: ip_addresses ip_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_addresses
    ADD CONSTRAINT ip_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16485)
-- Name: search_brands search_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_brands
    ADD CONSTRAINT search_brands_pkey PRIMARY KEY (search_id, brand_id);


--
-- TOC entry 4926 (class 2606 OID 16504)
-- Name: search_categories search_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_categories
    ADD CONSTRAINT search_categories_pkey PRIMARY KEY (search_id, category_id);


--
-- TOC entry 4928 (class 2606 OID 16523)
-- Name: search_collections search_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_collections
    ADD CONSTRAINT search_collections_pkey PRIMARY KEY (search_id, collection_id);


--
-- TOC entry 4920 (class 2606 OID 16456)
-- Name: search_metrics search_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_metrics
    ADD CONSTRAINT search_metrics_pkey PRIMARY KEY (search_id);


--
-- TOC entry 4918 (class 2606 OID 16443)
-- Name: searches searches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.searches
    ADD CONSTRAINT searches_pkey PRIMARY KEY (search_id);


--
-- TOC entry 4931 (class 2606 OID 16472)
-- Name: ip_addresses ip_addresses_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_addresses
    ADD CONSTRAINT ip_addresses_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.searches(search_id);


--
-- TOC entry 4932 (class 2606 OID 16491)
-- Name: search_brands search_brands_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_brands
    ADD CONSTRAINT search_brands_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(brand_id);


--
-- TOC entry 4933 (class 2606 OID 16486)
-- Name: search_brands search_brands_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_brands
    ADD CONSTRAINT search_brands_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.searches(search_id);


--
-- TOC entry 4934 (class 2606 OID 16510)
-- Name: search_categories search_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_categories
    ADD CONSTRAINT search_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 4935 (class 2606 OID 16505)
-- Name: search_categories search_categories_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_categories
    ADD CONSTRAINT search_categories_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.searches(search_id);


--
-- TOC entry 4936 (class 2606 OID 16529)
-- Name: search_collections search_collections_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_collections
    ADD CONSTRAINT search_collections_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(collection_id);


--
-- TOC entry 4937 (class 2606 OID 16524)
-- Name: search_collections search_collections_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_collections
    ADD CONSTRAINT search_collections_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.searches(search_id);


--
-- TOC entry 4930 (class 2606 OID 16457)
-- Name: search_metrics search_metrics_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_metrics
    ADD CONSTRAINT search_metrics_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.searches(search_id);


--
-- TOC entry 4929 (class 2606 OID 16444)
-- Name: searches searches_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.searches
    ADD CONSTRAINT searches_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


-- Completed on 2025-12-10 19:39:24

--
-- PostgreSQL database dump complete
--

\unrestrict hAZcWsdZJxXgnYqeDnC1XU6fYLRxcXZ3KhHXD5yqRWzeOiQtSBwUwwHVsJDqeXS

