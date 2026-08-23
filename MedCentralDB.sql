--
-- PostgreSQL database dump
--

\restrict eDcJV9NqLTTW6hgVRT4jwWVHLHO85D1KjB9u4IITawh1Kdk9gI2Yitv09HhPMAU

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-27 08:50:04

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

--
-- TOC entry 284 (class 1255 OID 65719)
-- Name: sync_physical_box_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_physical_box_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- CEIL(19.1) becomes 20. CEIL(19.0) stays 19.
    -- This represents how many boxes are physically sitting on the shelf.
    NEW.current_stock := CEIL(NEW.total_selling_units::DECIMAL / NULLIF(NEW.units_per_bulk, 0));
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_physical_box_count() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 266 (class 1259 OID 32769)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_id integer NOT NULL,
    hospital_id integer NOT NULL,
    item_id integer NOT NULL,
    department_id integer NOT NULL,
    quantity integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 32768)
-- Name: cart_items_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_cart_id_seq OWNER TO postgres;

--
-- TOC entry 5433 (class 0 OID 0)
-- Dependencies: 265
-- Name: cart_items_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_cart_id_seq OWNED BY public.cart_items.cart_id;


--
-- TOC entry 229 (class 1259 OID 16435)
-- Name: cfg_counties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_counties (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.cfg_counties OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16434)
-- Name: cfg_counties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_counties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_counties_id_seq OWNER TO postgres;

--
-- TOC entry 5434 (class 0 OID 0)
-- Dependencies: 228
-- Name: cfg_counties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_counties_id_seq OWNED BY public.cfg_counties.id;


--
-- TOC entry 225 (class 1259 OID 16417)
-- Name: cfg_damage_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_damage_types (
    id integer NOT NULL,
    label character varying(50) NOT NULL
);


ALTER TABLE public.cfg_damage_types OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16416)
-- Name: cfg_damage_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_damage_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_damage_types_id_seq OWNER TO postgres;

--
-- TOC entry 5435 (class 0 OID 0)
-- Dependencies: 224
-- Name: cfg_damage_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_damage_types_id_seq OWNED BY public.cfg_damage_types.id;


--
-- TOC entry 227 (class 1259 OID 16426)
-- Name: cfg_hospital_departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_hospital_departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.cfg_hospital_departments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16425)
-- Name: cfg_hospital_departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_hospital_departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_hospital_departments_id_seq OWNER TO postgres;

--
-- TOC entry 5436 (class 0 OID 0)
-- Dependencies: 226
-- Name: cfg_hospital_departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_hospital_departments_id_seq OWNED BY public.cfg_hospital_departments.id;


--
-- TOC entry 220 (class 1259 OID 16388)
-- Name: cfg_item_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_item_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.cfg_item_categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16387)
-- Name: cfg_item_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_item_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_item_categories_id_seq OWNER TO postgres;

--
-- TOC entry 5437 (class 0 OID 0)
-- Dependencies: 219
-- Name: cfg_item_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_item_categories_id_seq OWNED BY public.cfg_item_categories.id;


--
-- TOC entry 267 (class 1259 OID 32922)
-- Name: cfg_receive_item_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_receive_item_status (
    id character varying(20) NOT NULL,
    label character varying(100)
);


ALTER TABLE public.cfg_receive_item_status OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 17100)
-- Name: cfg_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.cfg_roles OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17099)
-- Name: cfg_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_roles_id_seq OWNER TO postgres;

--
-- TOC entry 5438 (class 0 OID 0)
-- Dependencies: 251
-- Name: cfg_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_roles_id_seq OWNED BY public.cfg_roles.id;


--
-- TOC entry 242 (class 1259 OID 16850)
-- Name: cfg_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_statuses (
    id integer NOT NULL,
    status_name character varying(50) NOT NULL
);


ALTER TABLE public.cfg_statuses OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16849)
-- Name: cfg_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 5439 (class 0 OID 0)
-- Dependencies: 241
-- Name: cfg_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_statuses_id_seq OWNED BY public.cfg_statuses.id;


--
-- TOC entry 221 (class 1259 OID 16398)
-- Name: cfg_storage_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_storage_options (
    code character(1) NOT NULL,
    description character varying(50) NOT NULL,
    temp_range character varying(50)
);


ALTER TABLE public.cfg_storage_options OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16406)
-- Name: cfg_uoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_uoms (
    id integer NOT NULL,
    name character varying(20) NOT NULL
);


ALTER TABLE public.cfg_uoms OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16405)
-- Name: cfg_uoms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_uoms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_uoms_id_seq OWNER TO postgres;

--
-- TOC entry 5440 (class 0 OID 0)
-- Dependencies: 222
-- Name: cfg_uoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_uoms_id_seq OWNED BY public.cfg_uoms.id;


--
-- TOC entry 271 (class 1259 OID 49239)
-- Name: cfg_vehicle_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_vehicle_categories (
    category_id integer NOT NULL,
    name character varying(20) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cfg_vehicle_categories OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 49238)
-- Name: cfg_vehicle_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_vehicle_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_vehicle_categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 5441 (class 0 OID 0)
-- Dependencies: 270
-- Name: cfg_vehicle_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_vehicle_categories_category_id_seq OWNED BY public.cfg_vehicle_categories.category_id;


--
-- TOC entry 274 (class 1259 OID 49316)
-- Name: cfg_vehicle_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_vehicle_types (
    type_code character varying(20) NOT NULL,
    display_name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.cfg_vehicle_types OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16567)
-- Name: cfg_warehouse_shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_warehouse_shelves (
    shelf_id integer NOT NULL,
    shelf_label character varying(50) NOT NULL,
    storage_type_code character(1) NOT NULL,
    bulk_uom_id integer NOT NULL,
    max_uom_capacity integer NOT NULL
);


ALTER TABLE public.cfg_warehouse_shelves OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16566)
-- Name: cfg_warehouse_shelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_warehouse_shelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_warehouse_shelves_shelf_id_seq OWNER TO postgres;

--
-- TOC entry 5442 (class 0 OID 0)
-- Dependencies: 233
-- Name: cfg_warehouse_shelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_warehouse_shelves_shelf_id_seq OWNED BY public.cfg_warehouse_shelves.shelf_id;


--
-- TOC entry 231 (class 1259 OID 16446)
-- Name: cfg_zones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfg_zones (
    id integer NOT NULL,
    county_id integer NOT NULL,
    zone_name character varying(100) NOT NULL
);


ALTER TABLE public.cfg_zones OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16445)
-- Name: cfg_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfg_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cfg_zones_id_seq OWNER TO postgres;

--
-- TOC entry 5443 (class 0 OID 0)
-- Dependencies: 230
-- Name: cfg_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cfg_zones_id_seq OWNED BY public.cfg_zones.id;


--
-- TOC entry 264 (class 1259 OID 24785)
-- Name: deliveries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deliveries (
    delivery_id integer NOT NULL,
    package_id integer NOT NULL,
    dispatched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivered_at timestamp without time zone,
    inspected character varying(3) DEFAULT 'no'::character varying NOT NULL
);


ALTER TABLE public.deliveries OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 24784)
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deliveries_delivery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deliveries_delivery_id_seq OWNER TO postgres;

--
-- TOC entry 5444 (class 0 OID 0)
-- Dependencies: 263
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deliveries_delivery_id_seq OWNED BY public.deliveries.delivery_id;


--
-- TOC entry 269 (class 1259 OID 32959)
-- Name: delivery_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_issues (
    issue_id integer NOT NULL,
    delivery_id integer NOT NULL,
    request_item_id integer NOT NULL,
    item_damage_status character varying(50),
    quantity_affected integer NOT NULL,
    type_of_damage integer,
    photo_evidence text,
    additional_info text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.delivery_issues OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 32958)
-- Name: delivery_issues_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delivery_issues_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_issues_issue_id_seq OWNER TO postgres;

--
-- TOC entry 5445 (class 0 OID 0)
-- Dependencies: 268
-- Name: delivery_issues_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delivery_issues_issue_id_seq OWNED BY public.delivery_issues.issue_id;


--
-- TOC entry 254 (class 1259 OID 17111)
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    driver_id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    phone_number character varying(20) NOT NULL,
    preferred_zone_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assignment_id integer
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 17110)
-- Name: drivers_driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_driver_id_seq OWNER TO postgres;

--
-- TOC entry 5446 (class 0 OID 0)
-- Dependencies: 253
-- Name: drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_driver_id_seq OWNED BY public.drivers.driver_id;


--
-- TOC entry 248 (class 1259 OID 16957)
-- Name: hospital_deactivation_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_deactivation_log (
    id integer NOT NULL,
    hospital_id integer NOT NULL,
    reason text NOT NULL,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospital_deactivation_log OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16956)
-- Name: hospital_deactivation_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospital_deactivation_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospital_deactivation_log_id_seq OWNER TO postgres;

--
-- TOC entry 5447 (class 0 OID 0)
-- Dependencies: 247
-- Name: hospital_deactivation_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospital_deactivation_log_id_seq OWNED BY public.hospital_deactivation_log.id;


--
-- TOC entry 246 (class 1259 OID 16935)
-- Name: hospital_department_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital_department_mapping (
    id integer NOT NULL,
    hospital_id integer NOT NULL,
    department_id integer NOT NULL
);


ALTER TABLE public.hospital_department_mapping OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16934)
-- Name: hospital_department_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospital_department_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospital_department_mapping_id_seq OWNER TO postgres;

--
-- TOC entry 5448 (class 0 OID 0)
-- Dependencies: 245
-- Name: hospital_department_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospital_department_mapping_id_seq OWNED BY public.hospital_department_mapping.id;


--
-- TOC entry 232 (class 1259 OID 16519)
-- Name: hospital_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospital_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospital_id_seq OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16910)
-- Name: hospitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals (
    hospital_id integer NOT NULL,
    zone_id integer NOT NULL,
    contact_person character varying(100) NOT NULL,
    phone_number character varying(25) NOT NULL,
    status character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospitals OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16909)
-- Name: hospitals_hospital_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitals_hospital_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitals_hospital_id_seq OWNER TO postgres;

--
-- TOC entry 5449 (class 0 OID 0)
-- Dependencies: 243
-- Name: hospitals_hospital_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitals_hospital_id_seq OWNED BY public.hospitals.hospital_id;


--
-- TOC entry 279 (class 1259 OID 65624)
-- Name: inbound_stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inbound_stock (
    stock_batch_id integer NOT NULL,
    supplier_name character varying(100) NOT NULL,
    delivery_note_number integer NOT NULL,
    delivery_date date DEFAULT CURRENT_DATE NOT NULL,
    received_by_user_id integer
);


ALTER TABLE public.inbound_stock OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 65623)
-- Name: inbound_stock_delivery_note_number_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inbound_stock ALTER COLUMN delivery_note_number ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inbound_stock_delivery_note_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 281 (class 1259 OID 65654)
-- Name: inbound_stock_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inbound_stock_items (
    inbound_item_id integer NOT NULL,
    stock_batch_id integer,
    quantity_received integer NOT NULL,
    expiry_date date NOT NULL,
    batch_number character varying(50) NOT NULL,
    sku_code character varying(100)
);


ALTER TABLE public.inbound_stock_items OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 65653)
-- Name: inbound_stock_items_inbound_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inbound_stock_items_inbound_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inbound_stock_items_inbound_item_id_seq OWNER TO postgres;

--
-- TOC entry 5450 (class 0 OID 0)
-- Dependencies: 280
-- Name: inbound_stock_items_inbound_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inbound_stock_items_inbound_item_id_seq OWNED BY public.inbound_stock_items.inbound_item_id;


--
-- TOC entry 277 (class 1259 OID 65622)
-- Name: inbound_stock_stock_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inbound_stock_stock_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inbound_stock_stock_batch_id_seq OWNER TO postgres;

--
-- TOC entry 5451 (class 0 OID 0)
-- Dependencies: 277
-- Name: inbound_stock_stock_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inbound_stock_stock_batch_id_seq OWNED BY public.inbound_stock.stock_batch_id;


--
-- TOC entry 236 (class 1259 OID 16687)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    item_id integer NOT NULL,
    name character varying(255) NOT NULL,
    sku_code character varying(100) NOT NULL,
    category_id integer NOT NULL,
    storage_temp_code character(1) NOT NULL,
    shelf_id integer,
    bulk_uom_id integer NOT NULL,
    selling_uom_id integer NOT NULL,
    units_per_bulk integer NOT NULL,
    price_per_selling numeric(12,2) NOT NULL,
    min_stock_level integer DEFAULT 0,
    current_stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_restocked timestamp without time zone,
    is_active boolean DEFAULT true,
    total_selling_units integer
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16686)
-- Name: items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_item_id_seq OWNER TO postgres;

--
-- TOC entry 5452 (class 0 OID 0)
-- Dependencies: 235
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_item_id_seq OWNED BY public.items.item_id;


--
-- TOC entry 260 (class 1259 OID 24733)
-- Name: order_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_packages (
    package_id integer NOT NULL,
    order_id integer NOT NULL,
    storage_temp_code character(1) NOT NULL,
    status_id integer DEFAULT 4 NOT NULL,
    assigned_clerk_id integer,
    assigned_driver_id integer,
    assigned_at timestamp without time zone,
    weight_tonnes numeric(10,4) DEFAULT 0.0000 NOT NULL
);


ALTER TABLE public.order_packages OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 24732)
-- Name: order_packages_package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_packages_package_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_packages_package_id_seq OWNER TO postgres;

--
-- TOC entry 5453 (class 0 OID 0)
-- Dependencies: 259
-- Name: order_packages_package_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_packages_package_id_seq OWNED BY public.order_packages.package_id;


--
-- TOC entry 258 (class 1259 OID 24716)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    request_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 24715)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 5454 (class 0 OID 0)
-- Dependencies: 257
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 262 (class 1259 OID 24765)
-- Name: package_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_items (
    package_item_id integer NOT NULL,
    package_id integer NOT NULL,
    request_item_id integer NOT NULL
);


ALTER TABLE public.package_items OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 24764)
-- Name: package_items_package_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.package_items_package_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.package_items_package_item_id_seq OWNER TO postgres;

--
-- TOC entry 5455 (class 0 OID 0)
-- Dependencies: 261
-- Name: package_items_package_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.package_items_package_item_id_seq OWNED BY public.package_items.package_item_id;


--
-- TOC entry 240 (class 1259 OID 16823)
-- Name: request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_items (
    request_item_id integer NOT NULL,
    request_id integer,
    item_id integer,
    department_id integer NOT NULL,
    quantity_requested integer NOT NULL,
    unit_price_at_request numeric(12,2) NOT NULL
);


ALTER TABLE public.request_items OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16822)
-- Name: request_items_request_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_items_request_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_items_request_item_id_seq OWNER TO postgres;

--
-- TOC entry 5456 (class 0 OID 0)
-- Dependencies: 239
-- Name: request_items_request_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_items_request_item_id_seq OWNED BY public.request_items.request_item_id;


--
-- TOC entry 250 (class 1259 OID 16975)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    request_id integer NOT NULL,
    hospital_id integer NOT NULL,
    status_id integer DEFAULT 1,
    total_estimated_value numeric(12,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp without time zone,
    paid_at timestamp without time zone,
    rejection_reason text
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16974)
-- Name: requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_request_id_seq OWNER TO postgres;

--
-- TOC entry 5457 (class 0 OID 0)
-- Dependencies: 249
-- Name: requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_request_id_seq OWNED BY public.requests.request_id;


--
-- TOC entry 238 (class 1259 OID 16737)
-- Name: stock_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_log (
    log_id integer NOT NULL,
    item_id integer,
    quantity_change integer NOT NULL,
    new_stock_level integer NOT NULL,
    adjustment_reason text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_log OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16736)
-- Name: stock_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_log_log_id_seq OWNER TO postgres;

--
-- TOC entry 5458 (class 0 OID 0)
-- Dependencies: 237
-- Name: stock_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_log_log_id_seq OWNED BY public.stock_log.log_id;


--
-- TOC entry 256 (class 1259 OID 17136)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    full_name character varying(100) NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hospital_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17135)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5459 (class 0 OID 0)
-- Dependencies: 255
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 273 (class 1259 OID 49296)
-- Name: vehicle_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_assignments (
    assignment_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    driver_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_assignments OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 49295)
-- Name: vehicle_assignments_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_assignments_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 272
-- Name: vehicle_assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_assignments_assignment_id_seq OWNED BY public.vehicle_assignments.assignment_id;


--
-- TOC entry 276 (class 1259 OID 49326)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    vehicle_id integer NOT NULL,
    plate_number character varying(20) NOT NULL,
    type_code character varying(20),
    category_id integer,
    max_tons numeric(5,2) NOT NULL,
    current_load_tons numeric(5,2) DEFAULT 0.0,
    temp_cap_codes text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 49325)
-- Name: vehicles_vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_vehicle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_vehicle_id_seq OWNER TO postgres;

--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 275
-- Name: vehicles_vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_vehicle_id_seq OWNED BY public.vehicles.vehicle_id;


--
-- TOC entry 283 (class 1259 OID 65680)
-- Name: wh_items_damages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wh_items_damages (
    item_damage_id integer NOT NULL,
    item_id integer NOT NULL,
    damage_id integer NOT NULL,
    quantity_affected integer NOT NULL,
    discovered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detailed_description text NOT NULL,
    photo_url text,
    action_taken text,
    reported_by_user_id integer,
    CONSTRAINT wh_items_damages_quantity_affected_check CHECK ((quantity_affected > 0))
);


ALTER TABLE public.wh_items_damages OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 65679)
-- Name: wh_items_damages_item_damage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wh_items_damages_item_damage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wh_items_damages_item_damage_id_seq OWNER TO postgres;

--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 282
-- Name: wh_items_damages_item_damage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wh_items_damages_item_damage_id_seq OWNED BY public.wh_items_damages.item_damage_id;


--
-- TOC entry 5057 (class 2604 OID 32772)
-- Name: cart_items cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_items_cart_id_seq'::regclass);


--
-- TOC entry 5020 (class 2604 OID 16438)
-- Name: cfg_counties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_counties ALTER COLUMN id SET DEFAULT nextval('public.cfg_counties_id_seq'::regclass);


--
-- TOC entry 5018 (class 2604 OID 16420)
-- Name: cfg_damage_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_damage_types ALTER COLUMN id SET DEFAULT nextval('public.cfg_damage_types_id_seq'::regclass);


--
-- TOC entry 5019 (class 2604 OID 16429)
-- Name: cfg_hospital_departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_hospital_departments ALTER COLUMN id SET DEFAULT nextval('public.cfg_hospital_departments_id_seq'::regclass);


--
-- TOC entry 5016 (class 2604 OID 16391)
-- Name: cfg_item_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_item_categories ALTER COLUMN id SET DEFAULT nextval('public.cfg_item_categories_id_seq'::regclass);


--
-- TOC entry 5041 (class 2604 OID 17103)
-- Name: cfg_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_roles ALTER COLUMN id SET DEFAULT nextval('public.cfg_roles_id_seq'::regclass);


--
-- TOC entry 5031 (class 2604 OID 16853)
-- Name: cfg_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_statuses ALTER COLUMN id SET DEFAULT nextval('public.cfg_statuses_id_seq'::regclass);


--
-- TOC entry 5017 (class 2604 OID 16409)
-- Name: cfg_uoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_uoms ALTER COLUMN id SET DEFAULT nextval('public.cfg_uoms_id_seq'::regclass);


--
-- TOC entry 5062 (class 2604 OID 49242)
-- Name: cfg_vehicle_categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_vehicle_categories ALTER COLUMN category_id SET DEFAULT nextval('public.cfg_vehicle_categories_category_id_seq'::regclass);


--
-- TOC entry 5022 (class 2604 OID 16570)
-- Name: cfg_warehouse_shelves shelf_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_warehouse_shelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.cfg_warehouse_shelves_shelf_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 16449)
-- Name: cfg_zones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_zones ALTER COLUMN id SET DEFAULT nextval('public.cfg_zones_id_seq'::regclass);


--
-- TOC entry 5054 (class 2604 OID 24788)
-- Name: deliveries delivery_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deliveries ALTER COLUMN delivery_id SET DEFAULT nextval('public.deliveries_delivery_id_seq'::regclass);


--
-- TOC entry 5060 (class 2604 OID 32962)
-- Name: delivery_issues issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_issues ALTER COLUMN issue_id SET DEFAULT nextval('public.delivery_issues_issue_id_seq'::regclass);


--
-- TOC entry 5042 (class 2604 OID 17114)
-- Name: drivers driver_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN driver_id SET DEFAULT nextval('public.drivers_driver_id_seq'::regclass);


--
-- TOC entry 5035 (class 2604 OID 16960)
-- Name: hospital_deactivation_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_deactivation_log ALTER COLUMN id SET DEFAULT nextval('public.hospital_deactivation_log_id_seq'::regclass);


--
-- TOC entry 5034 (class 2604 OID 16938)
-- Name: hospital_department_mapping id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_department_mapping ALTER COLUMN id SET DEFAULT nextval('public.hospital_department_mapping_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 16913)
-- Name: hospitals hospital_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN hospital_id SET DEFAULT nextval('public.hospitals_hospital_id_seq'::regclass);


--
-- TOC entry 5069 (class 2604 OID 65627)
-- Name: inbound_stock stock_batch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock ALTER COLUMN stock_batch_id SET DEFAULT nextval('public.inbound_stock_stock_batch_id_seq'::regclass);


--
-- TOC entry 5071 (class 2604 OID 65657)
-- Name: inbound_stock_items inbound_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock_items ALTER COLUMN inbound_item_id SET DEFAULT nextval('public.inbound_stock_items_inbound_item_id_seq'::regclass);


--
-- TOC entry 5023 (class 2604 OID 16690)
-- Name: items item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN item_id SET DEFAULT nextval('public.items_item_id_seq'::regclass);


--
-- TOC entry 5050 (class 2604 OID 24736)
-- Name: order_packages package_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages ALTER COLUMN package_id SET DEFAULT nextval('public.order_packages_package_id_seq'::regclass);


--
-- TOC entry 5048 (class 2604 OID 24719)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 5053 (class 2604 OID 24768)
-- Name: package_items package_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items ALTER COLUMN package_item_id SET DEFAULT nextval('public.package_items_package_item_id_seq'::regclass);


--
-- TOC entry 5030 (class 2604 OID 16826)
-- Name: request_items request_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items ALTER COLUMN request_item_id SET DEFAULT nextval('public.request_items_request_item_id_seq'::regclass);


--
-- TOC entry 5037 (class 2604 OID 16978)
-- Name: requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN request_id SET DEFAULT nextval('public.requests_request_id_seq'::regclass);


--
-- TOC entry 5028 (class 2604 OID 16740)
-- Name: stock_log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_log ALTER COLUMN log_id SET DEFAULT nextval('public.stock_log_log_id_seq'::regclass);


--
-- TOC entry 5045 (class 2604 OID 17139)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5064 (class 2604 OID 49299)
-- Name: vehicle_assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.vehicle_assignments_assignment_id_seq'::regclass);


--
-- TOC entry 5066 (class 2604 OID 49329)
-- Name: vehicles vehicle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN vehicle_id SET DEFAULT nextval('public.vehicles_vehicle_id_seq'::regclass);


--
-- TOC entry 5072 (class 2604 OID 65683)
-- Name: wh_items_damages item_damage_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_items_damages ALTER COLUMN item_damage_id SET DEFAULT nextval('public.wh_items_damages_item_damage_id_seq'::regclass);


--
-- TOC entry 5410 (class 0 OID 32769)
-- Dependencies: 266
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (cart_id, hospital_id, item_id, department_id, quantity, added_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5373 (class 0 OID 16435)
-- Dependencies: 229
-- Data for Name: cfg_counties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_counties (id, name) FROM stdin;
1	Nairobi
2	Mombasa
3	Kisumu
4	Nakuru
5	Uasin Gishu
6	Kiambu
\.


--
-- TOC entry 5369 (class 0 OID 16417)
-- Dependencies: 225
-- Data for Name: cfg_damage_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_damage_types (id, label) FROM stdin;
1	Expired
2	Broken Seal
3	Water Damage
4	Crushed Packaging
5	Temperature Excursion
6	Incorrect Batch
7	Other
\.


--
-- TOC entry 5371 (class 0 OID 16426)
-- Dependencies: 227
-- Data for Name: cfg_hospital_departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_hospital_departments (id, name) FROM stdin;
1	Pharmacy
2	Intensive Care Unit (ICU)
3	Emergency & Accident (A&E)
4	Pediatrics
5	Maternity & Neonatal
6	Surgical Theatre
7	Radiology & Imaging
8	Medical Laboratory
9	Outpatient Department (OPD)
10	Dental Clinic
11	Ophthalmology
12	Orthopedics
13	Inpatient / General Ward
14	Dialysis Center
15	Health Records & Administration
\.


--
-- TOC entry 5364 (class 0 OID 16388)
-- Dependencies: 220
-- Data for Name: cfg_item_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_item_categories (id, name) FROM stdin;
1	Antibiotics
2	Analgesics
3	Vaccines
4	Consumables
5	Surgical Equipment
6	Diabetes Care
7	Diagnostics
\.


--
-- TOC entry 5411 (class 0 OID 32922)
-- Dependencies: 267
-- Data for Name: cfg_receive_item_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_receive_item_status (id, label) FROM stdin;
STAT-GOOD	Good Condition
STAT-DMG	Damaged
STAT-EXP	Expired
STAT-WRNG	Wrong Item
\.


--
-- TOC entry 5396 (class 0 OID 17100)
-- Dependencies: 252
-- Data for Name: cfg_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_roles (id, name) FROM stdin;
1	Inventory Clerk
2	Warehouse Manager
3	Hospital
4	Admin
\.


--
-- TOC entry 5386 (class 0 OID 16850)
-- Dependencies: 242
-- Data for Name: cfg_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_statuses (id, status_name) FROM stdin;
1	Pending
2	Rejected
3	Approved
4	Processing
5	Packed
6	Dispatched
7	Delayed
8	Delivered
9	Delivered with Issues
10	Completed
\.


--
-- TOC entry 5365 (class 0 OID 16398)
-- Dependencies: 221
-- Data for Name: cfg_storage_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_storage_options (code, description, temp_range) FROM stdin;
A	Ambient	15°C to 25°C
R	Refrigerated	0°C to 4°C
F	Frozen	-20°C to -10°C
C	Crt	2°C to 8°C
\.


--
-- TOC entry 5367 (class 0 OID 16406)
-- Dependencies: 223
-- Data for Name: cfg_uoms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_uoms (id, name) FROM stdin;
1	Box
2	Vial
3	Carton
4	Bottle
5	Pack
6	Tray
7	Pallet
\.


--
-- TOC entry 5415 (class 0 OID 49239)
-- Dependencies: 271
-- Data for Name: cfg_vehicle_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_vehicle_categories (category_id, name, description, created_at) FROM stdin;
1	Light	Motorbikes and small hatchbacks	2026-04-14 09:30:26.319211
2	Medium	Panel vans, mostly 3-ton trucks	2026-04-14 09:30:26.319211
3	Heavy	Large trucks and trailers	2026-04-14 09:30:26.319211
\.


--
-- TOC entry 5418 (class 0 OID 49316)
-- Dependencies: 274
-- Data for Name: cfg_vehicle_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_vehicle_types (type_code, display_name, description) FROM stdin;
MOTORBIKE	Motorbike	\N
VAN_REF	Refrigerated Van	\N
VAN_AMB	Standard Delivery Van	\N
PICKUP	Pickup (1-Ton)	\N
TRUCK_MED	Canter (3-5 Ton)	\N
TRUCK_HVY	Prime Mover / Heavy Truck	\N
\.


--
-- TOC entry 5378 (class 0 OID 16567)
-- Dependencies: 234
-- Data for Name: cfg_warehouse_shelves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_warehouse_shelves (shelf_id, shelf_label, storage_type_code, bulk_uom_id, max_uom_capacity) FROM stdin;
5	CHL-SHELF-01	C	2	40
6	CHL-SHELF-02	C	2	40
8	REF-UNIT-02	R	2	15
9	REF-ZONE-A	R	3	30
11	FRZ-DEEP-02	F	2	20
13	FRZ-ULTRA-01	F	3	50
14	SHEL-001	A	3	50
15	SHEL-002	R	7	100
16	SHEL-003	F	2	70
17	ITEM-A-SHELF	A	5	500
18	ITEM-R-SHELF	R	1	1000
19	REF-SHELF-1	R	2	1500
20	AMB-SHELF-1	A	1	150
21	SHEL-004	C	6	100
\.


--
-- TOC entry 5375 (class 0 OID 16446)
-- Dependencies: 231
-- Data for Name: cfg_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cfg_zones (id, county_id, zone_name) FROM stdin;
1	1	Westlands
2	1	CBD
3	1	Upper Hill
4	1	Kibra
5	1	Embakasi
6	2	Nyali
7	2	Likoni
8	2	Changamwe
9	3	Milimani
10	3	Kondele
11	4	Naivasha
12	4	Nakuru Town
13	5	Eldoret Central
14	5	Kapseret
15	6	Thika
16	6	Ruiru
17	6	Kikuyu
\.


--
-- TOC entry 5408 (class 0 OID 24785)
-- Dependencies: 264
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deliveries (delivery_id, package_id, dispatched_at, delivered_at, inspected) FROM stdin;
6	5	2026-03-29 11:30:00	2026-03-29 17:45:00	yes
9	18	2026-04-18 10:04:03.231044	2026-04-18 10:05:32.40311	yes
14	6	2026-04-21 23:48:13.567105	2026-04-21 23:48:13.567105	no
10	19	2026-04-18 10:04:03.231044	2026-04-23 20:07:33.520145	yes
7	7	2026-03-29 09:15:00	2026-04-23 20:07:57.276619	yes
18	23	2026-04-23 20:21:00.93354	2026-04-23 20:21:44.057232	no
17	17	2026-04-23 16:03:11.847505	2026-04-23 20:22:24.364749	no
19	32	2026-05-15 09:18:04.710154	2026-05-15 09:20:49.289311	yes
20	33	2026-05-15 10:55:43.940416	2026-05-15 10:55:52.212642	yes
21	36	2026-05-17 08:39:02.302226	2026-05-18 13:12:54.743985	yes
\.


--
-- TOC entry 5413 (class 0 OID 32959)
-- Dependencies: 269
-- Data for Name: delivery_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_issues (issue_id, delivery_id, request_item_id, item_damage_status, quantity_affected, type_of_damage, photo_evidence, additional_info, created_at) FROM stdin;
1	7	7	STAT-EXP	2	0	\N		2026-03-31 15:08:41.226072
2	7	7	STAT-EXP	3	\N	\N		2026-03-31 15:10:12.524522
3	7	7	STAT-EXP	2	\N	\N		2026-03-31 15:11:07.825032
4	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:12:04.537085
5	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:12:38.23019
6	7	8	STAT-WRNG	3	\N	\N	\N	2026-03-31 15:12:38.238176
7	6	5	STAT-EXP	2	\N	\N	\N	2026-03-31 15:14:32.725626
8	6	4	STAT-DMG	4	2	\N	\N	2026-03-31 15:14:32.726161
9	6	6	STAT-DMG	3	7	\N	Other test	2026-03-31 15:14:32.726942
10	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:41:20.510249
11	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:41:20.511178
12	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:41:47.953125
13	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:41:47.955394
14	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:42:33.247985
15	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:42:33.257169
16	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:43:14.488434
17	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:43:14.49045
18	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:43:38.241341
19	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:43:38.242168
20	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:49:14.572877
21	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:49:14.57923
22	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:49:54.292013
23	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:49:54.303596
24	6	4	STAT-EXP	7	\N	\N	\N	2026-03-31 15:53:02.293765
25	6	2	STAT-DMG	5	4	\N	\N	2026-03-31 15:53:02.296722
26	6	2	STAT-DMG	5	4	\N	\N	2026-03-31 15:53:02.311063
27	6	4	STAT-EXP	7	\N	\N	\N	2026-03-31 15:53:02.339267
28	6	4	STAT-EXP	7	\N	\N	\N	2026-03-31 15:55:44.678197
29	6	2	STAT-DMG	5	4	\N	\N	2026-03-31 15:55:44.688068
30	6	4	STAT-EXP	7	\N	\N	\N	2026-03-31 15:55:44.708005
31	6	2	STAT-DMG	5	4	\N	\N	2026-03-31 15:55:44.708992
32	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:57:39.799967
33	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 15:57:39.801043
34	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 16:00:03.665541
35	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 16:01:18.205373
40	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 16:24:06.019678
41	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 16:29:38.710227
42	7	7	STAT-EXP	3	\N	\N	\N	2026-03-31 16:34:36.127147
\.


--
-- TOC entry 5398 (class 0 OID 17111)
-- Dependencies: 254
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (driver_id, full_name, phone_number, preferred_zone_id, is_active, created_at, assignment_id) FROM stdin;
11	Baby Driver	123456	3	t	2026-03-09 22:38:28.971444	\N
12	Kinara 6Star	098765	11	f	2026-03-09 22:39:44.19866	\N
18	John Wick	2345678900	16	t	2026-04-14 23:04:47.775489	\N
1	John Doe	+254711223344	1	f	2026-03-07 20:45:38.476907	1
2	Pita Kamau	+254722334455	1	t	2026-03-07 20:45:38.476907	2
3	Sarah Njerae	+254733445566	2	t	2026-03-07 20:45:38.476907	3
4	David Omondi	+254712345678	2	t	2026-03-07 20:45:38.476907	4
5	Ali Hassan	+254712345678	3	t	2026-03-07 20:45:38.476907	5
7	Omar Bakari	+254734567890	12	t	2026-03-07 20:45:38.476907	7
8	James Chege	+254745678901	4	t	2026-03-07 20:45:38.476907	8
9	Mary Wambui	+254756789012	4	t	2026-03-07 20:45:38.476907	9
10	Samuel Kipkorir	+254767890123	4	t	2026-03-07 20:45:38.476907	10
20	Mad Max	0912346	11	t	2026-04-21 22:50:26.69283	11
22	Driver Test	07999888	3	t	2026-05-10 20:06:12.249914	12
24	Ka Dere	567890754	11	t	2026-05-10 20:10:22.316802	13
25	Baby Dere	2456367	13	t	2026-05-10 20:11:45.434603	14
6	Fatuma Juma	+254723456789	6	f	2026-03-07 20:45:38.476907	6
\.


--
-- TOC entry 5392 (class 0 OID 16957)
-- Dependencies: 248
-- Data for Name: hospital_deactivation_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_deactivation_log (id, hospital_id, reason, changed_at) FROM stdin;
1	5	Way too green	2026-05-09 20:48:48.691096
\.


--
-- TOC entry 5390 (class 0 OID 16935)
-- Dependencies: 246
-- Data for Name: hospital_department_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital_department_mapping (id, hospital_id, department_id) FROM stdin;
6	20	14
7	20	15
8	20	6
9	21	10
10	21	5
11	21	3
12	22	11
13	22	7
16	22	5
27	22	2
28	22	4
\.


--
-- TOC entry 5388 (class 0 OID 16910)
-- Dependencies: 244
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitals (hospital_id, zone_id, contact_person, phone_number, status, created_at) FROM stdin;
1	1	Dr. Juliet Mutua	+254 712 345 678	active	2026-03-21 22:49:21.916613
2	6	Hassan Ali	+254 722 000 111	active	2026-03-21 22:49:21.916613
4	11	Mercy Achieng	+254 701 555 444	active	2026-03-21 22:49:21.916613
5	15	Samuel Kamau	+254 788 222 333	inactive	2026-03-21 22:49:21.916613
3	10	Dr. Benson Kipchoge	+254 733 999 888	active	2026-03-21 22:49:21.916613
20	11	Max	12345	active	2026-03-22 00:18:37.277629
21	14	Dr TestOne	4567890	active	2026-03-27 23:16:52.693685
22	3	Dr. WamaH	25407921234	active	2026-05-08 15:59:12.001156
\.


--
-- TOC entry 5423 (class 0 OID 65624)
-- Dependencies: 279
-- Data for Name: inbound_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inbound_stock (stock_batch_id, supplier_name, delivery_note_number, delivery_date, received_by_user_id) FROM stdin;
1	Supplier	1	2026-04-17	28
2	Supplier	2	2026-04-17	28
3	Supplier	3	2026-04-17	28
4	Supplier	4	2026-04-17	28
5	Supplier	5	2026-04-17	28
6	Supplier	6	2026-04-17	28
7	Supplier	7	2026-04-17	28
8	Supplier-1	8	2026-04-17	28
9	Supplier-12	9	2026-04-17	28
10	Supplier-12	10	2026-04-17	28
11	Supplier-12	11	2026-04-17	28
12	Supplier-12	12	2026-04-17	28
13	Supplier-12	13	2026-04-17	28
14	Supplier-123	14	2026-04-17	28
15	Supplier-123	15	2026-04-17	28
16	Supplier-1234	16	2026-04-17	28
17	Supplier-1234	17	2026-04-17	28
18	Supplier-123	18	2026-04-17	28
19	Supplier-12	19	2026-04-23	28
20	Davis Drugs	20	2026-05-18	28
\.


--
-- TOC entry 5425 (class 0 OID 65654)
-- Dependencies: 281
-- Data for Name: inbound_stock_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inbound_stock_items (inbound_item_id, stock_batch_id, quantity_received, expiry_date, batch_number, sku_code) FROM stdin;
1	1	1	2026-05-08	1	ITM-ONE
2	1	2	2026-05-05	2	ITM-TWO
3	2	20	2026-05-09	AMX-500-17	ANT-AMX-101
4	2	12	2026-05-07	SCL-17	SUR-SCL-11
5	2	35	2026-05-06	BCG-17	VAC-BCG-001
6	3	20	2026-05-09	AMX-500-17	ANT-AMX-101
7	3	12	2026-05-07	SCL-17	SUR-SCL-11
8	3	35	2026-05-06	BCG-17	VAC-BCG-001
9	4	20	2026-05-09	AMX-500-17	ANT-AMX-101
10	4	12	2026-05-07	SCL-17	SUR-SCL-11
11	4	35	2026-05-06	BCG-17	VAC-BCG-001
12	5	20	2026-05-09	AMX-500-17	ANT-AMX-101
13	5	12	2026-05-07	SCL-17	SUR-SCL-11
14	5	35	2026-05-06	BCG-17	VAC-BCG-001
15	6	20	2026-05-09	AMX-500-17	ANT-AMX-101
16	6	12	2026-05-07	SCL-17	SUR-SCL-11
17	6	35	2026-05-06	BCG-17	VAC-BCG-001
18	7	15	2026-05-28	HEPB-17	VAC-HEPB-003
19	7	10	2026-05-16	AZI-17	ANT-AZI-103
20	8	25	2026-05-17	OPV-17	VAC-OPV-002
21	9	12	2026-05-09	N95-17	PPE-N95-01
22	10	12	2026-05-09	N95-17	PPE-N95-01
23	11	12	2026-05-09	N95-17	PPE-N95-01
24	12	12	2026-05-09	N95-17	PPE-N95-01
25	13	12	2026-05-09	N95-17	PPE-N95-01
26	14	10	2026-05-08	BCG-171	VAC-BCG-001
27	14	20	2026-05-09	CIP-172	ANT-CIP-102
28	15	10	2026-04-30	OPV-172	VAC-OPV-002
29	16	10	2026-04-30	FSH-17	PPE-FSH-01
30	17	10	2026-04-30	FSH-17	PPE-FSH-01
31	18	12	2026-05-09	ONE-17	ITM-ONE
32	19	3000	2026-04-30	1	VAC-BCG-001
33	20	10	2026-09-18	BA-01	PPE-N95-01
34	20	30	2026-12-03	ANT-09	ANT-CIP-102
\.


--
-- TOC entry 5380 (class 0 OID 16687)
-- Dependencies: 236
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (item_id, name, sku_code, category_id, storage_temp_code, shelf_id, bulk_uom_id, selling_uom_id, units_per_bulk, price_per_selling, min_stock_level, current_stock, created_at, last_restocked, is_active, total_selling_units) FROM stdin;
3	Hepatitis B Vaccine	VAC-HEPB-003	1	C	5	1	2	10	450.00	30	19	2026-03-07 12:01:02.51257	2026-02-15 14:30:00	t	190
20	Item Three	ITEM-3	3	R	\N	3	2	30	200.00	90	0	2026-05-09 22:58:32.242551	\N	t	\N
13	Item One	ITM-ONE	3	R	18	1	2	30	200.00	2	13	2026-04-15 13:26:38.687112	\N	t	388
14	Item Two	ITM-TWO	6	A	17	5	2	50	300.00	20	1	2026-04-15 13:32:47.061305	\N	t	30
4	Amoxicillin 500mg	ANT-AMX-101	3	A	\N	1	4	100	15.50	500	1300	2026-03-07 12:01:02.51257	\N	t	129997
8	Scalpel Blades	SUR-SCL-11	2	A	\N	3	4	3	12.00	50	3493	2026-03-07 12:01:02.51257	\N	t	10479
1	BCG Vaccine 1ml	VAC-BCG-001	1	C	\N	1	2	10	250.00	50	300	2026-03-07 12:01:02.51257	2026-03-01 09:15:00	t	3000
2	Oral Polio Vaccine	VAC-OPV-002	1	F	\N	1	2	20	180.00	100	476	2026-03-07 12:01:02.51257	\N	t	9515
9	N95 Respirator Mask	PPE-N95-01	4	R	19	2	4	20	150.00	100	561	2026-03-07 12:01:02.51257	2025-12-20 08:00:00	t	11201
5	Ciprofloxacin 250mg	ANT-CIP-102	3	A	\N	1	4	100	22.00	200	21	2026-03-07 12:01:02.51257	\N	t	2023
10	Face Shields	PPE-FSH-01	4	A	\N	3	4	10	300.00	20	19	2026-03-07 12:01:02.51257	\N	t	183
7	Surgical Gloves (Size 7)	SUR-GLV-70	2	A	\N	1	4	50	45.00	200	994	2026-03-07 12:01:02.51257	\N	t	49691
21	Blufen	BLU-12	1	A	\N	1	1	20	100.00	5	\N	2026-05-17 21:08:54.783818	\N	t	\N
6	Azithromycin 500mg	ANT-AZI-103	3	R	\N	2	4	30	85.00	100	19	2026-03-07 12:01:02.51257	2026-03-08 11:00:00	t	568
\.


--
-- TOC entry 5404 (class 0 OID 24733)
-- Dependencies: 260
-- Data for Name: order_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_packages (package_id, order_id, storage_temp_code, status_id, assigned_clerk_id, assigned_driver_id, assigned_at, weight_tonnes) FROM stdin;
39	29	A	4	4	\N	2026-05-17 14:02:01.076448	0.0000
41	29	R	5	4	24	2026-05-17 14:10:33.957987	0.1000
38	28	R	5	4	24	2026-05-17 15:23:02.375969	0.5000
34	27	A	5	28	7	2026-05-18 13:05:10.282698	0.0000
35	27	R	4	4	\N	2026-05-18 13:36:06.052357	0.0000
37	28	F	4	28	\N	2026-05-18 13:36:16.88638	0.0000
30	22	A	4	28	\N	2026-05-18 13:40:41.175318	0.0000
40	29	C	5	4	20	2026-05-18 14:23:58.951178	0.1500
31	22	R	5	4	24	2026-05-18 14:24:16.803753	0.0200
42	30	A	4	\N	\N	\N	0.0000
43	30	R	4	\N	\N	\N	0.0000
36	28	A	10	28	7	2026-05-17 08:38:42.209604	0.6000
7	803	C	8	28	7	\N	0.0000
23	801	F	8	28	1	\N	0.0000
17	15	A	8	28	2	\N	90.0000
19	15	F	10	28	3	\N	0.0000
5	803	F	6	3	5	\N	0.0000
18	15	C	7	28	\N	2026-04-14 15:21:50.331129	0.0000
6	804	R	9	3	6	\N	0.0000
32	26	A	10	28	7	2026-05-15 09:16:17.173635	1.0000
33	26	R	10	28	24	2026-05-15 10:55:30.763222	0.8000
\.


--
-- TOC entry 5402 (class 0 OID 24716)
-- Dependencies: 258
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, request_id, created_at) FROM stdin;
801	50001	2026-03-29 17:12:50.567469
803	50003	2026-03-29 17:12:50.567469
804	50004	2026-03-29 17:12:50.567469
15	50002	2026-04-13 14:25:59.31434
22	3	2026-05-15 08:44:51.184954
26	4	2026-05-15 09:01:56.443456
27	5	2026-05-15 09:02:28.307922
28	6	2026-05-17 08:35:37.443546
29	8	2026-05-17 13:14:51.882299
30	9	2026-05-18 20:47:25.819696
\.


--
-- TOC entry 5406 (class 0 OID 24765)
-- Dependencies: 262
-- Data for Name: package_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_items (package_item_id, package_id, request_item_id) FROM stdin;
2	5	2
3	6	3
4	5	4
5	5	5
6	5	6
7	7	7
8	7	8
31	17	16
32	17	18
33	17	19
34	17	20
35	17	21
36	17	23
37	18	17
38	19	22
48	30	24
49	30	26
50	31	25
51	31	27
52	32	28
53	32	30
54	33	29
55	33	31
56	34	33
57	34	34
58	35	32
59	36	35
60	36	36
61	36	37
62	37	38
63	38	39
64	39	45
65	39	46
66	40	47
67	41	44
68	42	48
69	42	49
70	43	50
\.


--
-- TOC entry 5384 (class 0 OID 16823)
-- Dependencies: 240
-- Data for Name: request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_items (request_item_id, request_id, item_id, department_id, quantity_requested, unit_price_at_request) FROM stdin;
1	1	2	3	9	180.00
2	1	7	7	5	45.00
3	1	3	14	8	450.00
4	50003	1	1	150	45.00
5	50003	2	1	200	12.50
6	50003	5	2	80	150.00
7	50003	8	4	15	1200.00
8	50003	10	4	40	350.00
9	2	5	1	10	1200.00
10	2	8	4	500	8.50
11	2	3	1	5	45.00
16	50002	5	1	15	1200.00
17	50002	3	1	50	450.50
18	50002	10	3	200	12.00
19	50002	9	2	5	3500.00
20	50002	8	1	17	1000.00
21	50002	6	1	5	4500.50
22	50002	2	3	250	120.00
23	50002	4	2	50	550.00
24	3	8	4	5	12.00
25	3	9	6	3	150.00
26	3	7	6	5	45.00
27	3	13	6	1	200.00
28	4	8	4	5	12.00
29	4	9	6	3	150.00
30	4	7	6	5	45.00
31	4	13	6	1	200.00
32	5	6	6	3	85.00
33	5	4	6	3	15.50
34	5	5	6	4	22.00
35	6	10	15	6	300.00
36	6	8	6	11	12.00
37	6	7	14	4	45.00
38	6	2	15	5	180.00
39	6	9	15	3	150.00
40	7	13	15	3	200.00
41	7	7	14	20	45.00
42	7	20	14	7	200.00
43	7	5	15	12	22.00
44	8	6	14	4	85.00
45	8	7	7	25	45.00
46	8	5	11	3	22.00
47	8	1	5	30	250.00
48	9	7	6	20	45.00
49	9	21	14	32	100.00
50	9	6	14	25	85.00
55	13	3	5	30	450.00
56	13	21	10	20	100.00
57	14	20	15	5	200.00
58	15	20	15	5	200.00
59	15	1	14	3	250.00
60	14	1	14	3	250.00
61	16	3	15	1	450.00
62	16	4	6	5	15.50
63	17	20	6	4	200.00
64	18	3	5	6	450.00
65	18	4	2	4	15.50
66	19	20	7	10	200.00
67	19	8	2	6	12.00
\.


--
-- TOC entry 5394 (class 0 OID 16975)
-- Dependencies: 250
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (request_id, hospital_id, status_id, total_estimated_value, created_at, approved_at, paid_at, rejection_reason) FROM stdin;
50004	5	9	12400.00	2026-03-29 17:12:21.466222	\N	\N	\N
50001	1	2	1500.50	2026-03-29 17:12:21.466222	\N	\N	I do not love it.
50003	1	3	890.25	2026-03-29 17:12:21.466222	2026-04-13 22:52:35.827369	\N	\N
1	21	3	5445.00	2026-03-29 16:28:51.200966	\N	\N	\N
50002	21	3	2750.00	2026-03-29 17:12:21.466222	\N	\N	Deny test1 for kapseret
3	20	4	935.00	2026-05-15 08:26:03.34382	2026-05-15 08:40:19.310648	\N	\N
4	20	4	935.00	2026-05-15 08:26:03.328769	2026-05-15 09:00:11.398167	\N	\N
5	20	4	389.50	2026-05-15 08:38:55.389901	2026-05-15 09:02:18.292722	\N	\N
7	20	2	3164.00	2026-05-17 08:15:36.076435	\N	\N	Item 3 not available
6	20	4	3462.00	2026-05-17 07:51:52.337094	2026-05-17 08:35:22.570722	\N	\N
8	22	4	9031.00	2026-05-17 08:55:50.429318	2026-05-17 13:14:02.00563	\N	\N
2	21	3	10050.00	2026-04-09 21:17:45.03324	2026-05-18 13:30:20.367058	\N	\N
10	20	2	6225.00	2026-05-18 20:44:34.600715	\N	\N	No items
9	20	4	6225.00	2026-05-18 20:44:34.501194	2026-05-18 20:46:40.479797	\N	\N
13	21	1	15500.00	2026-05-18 21:40:03.840175	\N	\N	\N
15	20	1	1750.00	2026-06-11 14:15:51.604262	\N	\N	\N
14	20	1	1750.00	2026-06-11 14:15:51.580782	\N	\N	\N
16	20	1	527.50	2026-06-11 14:36:13.248007	\N	\N	\N
17	20	1	800.00	2026-06-11 14:37:41.767894	\N	\N	\N
18	22	1	2762.00	2026-06-11 14:42:05.148334	\N	\N	\N
19	22	1	2072.00	2026-06-11 14:44:20.728959	\N	\N	\N
\.


--
-- TOC entry 5382 (class 0 OID 16737)
-- Dependencies: 238
-- Data for Name: stock_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_log (log_id, item_id, quantity_change, new_stock_level, adjustment_reason, created_at) FROM stdin;
1	4	-1000	300	Testing	2026-04-23 21:10:04.825876
2	1	-85	300	Testing	2026-04-23 21:10:04.836092
3	1	-85	300	Testing	2026-04-23 21:10:04.839664
4	1	-850	3000	iopphjmk	2026-04-23 21:47:16.483917
5	1	850	3850	poiuytgb	2026-04-23 21:48:16.683616
6	1	-850	3000	qerttqwer	2026-04-23 21:51:01.493324
7	1	850	3850	qewrttewqe	2026-04-23 21:53:49.496473
8	1	-850	3000	qwerrasdf	2026-04-23 21:54:13.01776
9	1	-2970	30	qweradfg	2026-04-23 21:56:26.284415
10	14	-70	30	qweradfg	2026-04-23 21:56:26.347112
11	14	-70	30	qweradfg	2026-04-23 21:56:26.358593
\.


--
-- TOC entry 5400 (class 0 OID 17136)
-- Dependencies: 256
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password_hash, full_name, role_id, is_active, last_login, created_at, hospital_id) FROM stdin;
10	gretchen.bodinski@medcentral.com	$2b$12$ExmPl3H4sh10	Gretchen Bodinski	2	t	2026-03-07 07:30:00	2026-03-07 20:44:23.534882	\N
5	rachel.z@medcentral.com	$2b$12$ExmPl3H4sh05	Rachel Zane	1	t	2026-03-07 11:20:00	2026-03-07 20:44:23.534882	\N
7	katrina.bennett@medcentral.com	$2b$12$/84gUzH7fNFoTSsKF/IhTuVP9wNKHP6hyAbNZt9N14i0fI1A5FBw.	Katrina Bennett	1	t	2026-03-05 08:00:00	2026-03-07 20:44:23.534882	\N
12	daniel.hardman@medcentral.com	$2b$12$pxVP1pko6WkqcEKxn4img.5KJTUik34rf6tx/ditTrHAQ1LnwZhMy	Daniel Hardman	2	f	2025-12-20 16:45:00	2026-03-07 21:00:25.668283	\N
11	robert.zane@medcentral.com	$2b$12$ExmPl3H4sh11	Robert Zane	1	t	2026-01-15 09:00:00	2026-03-07 21:00:25.668283	\N
31	wama@nhome	$2b$12$3KVZ7wrDHIGxY9Gux2hjbu/Q8N5kmW3bq.gJc33k87DY8fbIYBRMa	Wama Nursing Home	3	t	2026-06-13 15:51:52.378526	2026-05-08 15:59:12.001156	22
3	jessica.pearson@med.com	$2b$12$ExmPl3H4sh03	Jessica Pearson	2	f	2026-03-06 17:00:00	2026-03-07 20:44:23.534882	\N
8	erick@sawa	$2b$12$ExmPl3H4sh08	Erick Sawa	2	t	\N	2026-03-07 20:44:23.534882	\N
1	harvey.specter@medcentral.com	$2b$12$DJL6C77TtxxJBg1YEToQk.UX23qdlV1P6JSV36rlIoLfkLNi9f2zq	Harvey Specter	2	f	2026-03-07 08:30:00	2026-03-07 20:44:23.534882	\N
2	donna.paulsen@medcentral.com	$2b$12$ExmPl3H4sh02	Donnannn Paulsen	2	f	2026-03-07 09:15:00	2026-03-07 20:44:23.534882	\N
6	louis.litt@medcentral.com	$2b$12$ExmPl3H4sh06	Louis Litt	1	t	\N	2026-03-07 20:44:23.534882	\N
13	mann@gann	$2b$12$co4Z8ysW9/CAc8TTO5CJMOSkzTTc1yVp9/AjjyO0PvvLuMFLWie3q	Mary Ann	2	t	\N	2026-03-09 22:14:48.774154	\N
22	info@nyalimed.co.ke	$2b$12$r9iF75iGbD24BdSS4cJNSeyTmsbKIBSeczhigkekMcFFTLNlyfylK	Nyali Medical Center	3	t	2026-05-17 08:47:23.272031	2026-03-21 23:31:28.380598	2
14	pwalker@pw	$2b$12$mTuIrP0a65KTQE06ygH.tOyAPt5aW8OU2sRH2l0MK7vp3yfQNrEcm	Paul Walker	2	t	\N	2026-03-09 22:15:40.32816	\N
21	admin@westlandsspec.co.ke	$2b$12$R9yWvX...hash1	Westlands Specialists	3	t	\N	2026-03-21 23:31:28.380598	1
23	logistics@kondele.co.ke	$2b$12$T7aVbC...hash3	Kondele Community Clinic	3	f	\N	2026-03-21 23:31:28.380598	3
24	admin@naivashahwy.co.ke	$2b$12$U6cUdT...hash4	Naivasha Highway Hospital	3	t	\N	2026-03-21 23:31:28.380598	4
25	contact@thikagreens.go.ke	$2b$12$V5eWfG...hash5	Thika Greens Medical	3	t	\N	2026-03-21 23:31:28.380598	5
9	samantha.wheeler@medcentral.com	$2b$12$NAnu5TiozXU15l2tGJJRKeqFcTWUUsEobn6pd1DjNQ7WWfcNommUa	Samantha Wheeler	1	t	2026-03-07 12:45:00	2026-03-07 20:44:23.534882	\N
32	managertest@med	$2b$12$ffT208GYTc299IajxF5ibeT3CTqYBH/3/JbH3eHZpK1MSxIWYgjDy	Manager Testie	2	f	2026-05-10 19:47:54.23839	2026-05-10 19:29:28.578394	\N
33	clerktest@med	$2b$12$QoJTxBUqhpxuFmKukQMEj.YsjmzSjhQuT4BwtepZUzKjIAqZDr4kq	Clerk Test	1	t	2026-05-10 19:49:45.380858	2026-05-10 19:49:07.900835	\N
26	curemax@org	$2b$12$kfwTMfIe4huC.UZ8Or3O4eNE4YHJ45oOZ8Lg6/7kTFh6TGHnk7Hku	CureMax	3	t	2026-06-13 21:41:03.044132	2026-03-22 00:18:37.277629	20
27	admin@test1	$2b$12$IMGntroaAMEniM2njgO/k.vHUN0XQTxCvyE4b86B4WK5HjUdly3/i	Test1	3	t	2026-06-13 21:42:25.630696	2026-03-27 23:16:52.693685	21
30	max.admin@medcentral.com	$2b$12$agVh28K6TPr0s3QucHttzOJS6RydtAs8pnS6FWsnYUX2AaaMuRCry	Max Admin	4	t	2026-06-13 21:42:41.705419	2026-04-24 12:21:39.667567	\N
4	mike.ross@medcentral.com	$2b$12$1Yao.YR8Dzsd1QhbftLnCuYFVPGWUkeJrqxQOevi/49LhTJVJ1Sny	Mike Ross	1	t	2026-05-17 13:51:22.413646	2026-03-07 20:44:23.534882	\N
29	whman@wmn	$2b$12$aPB.KOTQs.buCGHEJCgsLe0.HjKA5ChnEXt/ArZwK9eHgBuHrrplS	WManager One	2	t	2026-06-13 21:55:09.469599	2026-03-27 23:19:29.18431	\N
28	clerk1@clerk	$2b$12$DxXhp2Ii/Urn8pl/eMgwr.sxsijBOlUhKS/pnoxWdq4ooDZRvbPyC	Clerk One	1	t	2026-06-14 00:00:23.832351	2026-03-27 23:17:54.893969	\N
\.


--
-- TOC entry 5417 (class 0 OID 49296)
-- Dependencies: 273
-- Data for Name: vehicle_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_assignments (assignment_id, vehicle_id, driver_id, assigned_at) FROM stdin;
1	1	1	2026-04-21 22:04:27.923901
2	2	2	2026-04-21 22:04:27.923901
3	3	3	2026-04-21 22:04:27.923901
4	4	4	2026-04-21 22:04:27.923901
5	5	5	2026-04-21 22:04:27.923901
6	6	6	2026-04-21 22:04:27.923901
7	7	7	2026-04-21 22:04:27.923901
8	8	8	2026-04-21 22:04:27.923901
9	9	9	2026-04-21 22:04:27.923901
10	10	10	2026-04-21 22:04:27.923901
11	11	20	2026-04-21 22:50:26.69283
12	13	22	2026-05-10 20:06:12.249914
13	15	24	2026-05-10 20:10:22.316802
14	16	25	2026-05-10 20:11:45.434603
\.


--
-- TOC entry 5420 (class 0 OID 49326)
-- Dependencies: 276
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (vehicle_id, plate_number, type_code, category_id, max_tons, current_load_tons, temp_cap_codes, created_at) FROM stdin;
1	KMCA 102Z	MOTORBIKE	1	0.10	0.00	{A}	2026-04-14 09:53:16.02029
2	KDD 445L	VAN_REF	1	0.85	0.00	{R,F}	2026-04-14 09:53:16.02029
3	KDE 990X	VAN_AMB	2	2.50	0.00	{A,C}	2026-04-14 09:53:16.02029
4	KDF 221M	TRUCK_MED	2	4.50	0.00	{A,C}	2026-04-14 09:53:16.02029
5	KDG 778P	TRUCK_HVY	3	12.00	0.00	{A}	2026-04-14 09:53:16.02029
6	KDS 562W	VAN_REF	2	12.00	0.00	{R,F}	2026-04-14 23:04:47.775489
8	KCC 789Y	TRUCK_MED	2	3.50	0.00	{R,F}	2026-04-21 21:52:41.758808
9	KDA 456Z	VAN_AMB	1	7.50	0.00	{A}	2026-04-21 21:52:41.758808
10	KBE 555A	PICKUP	3	1.20	0.00	{A,C}	2026-04-21 21:52:41.758808
13	KCA 446	TRUCK_HVY	2	40.00	0.00	{A,R,F}	2026-05-10 20:06:12.249914
16	KHJ 1345	PICKUP	2	34.00	0.00	{A,R,F}	2026-05-10 20:11:45.434603
7	KBD 123X	TRUCK_HVY	1	15.00	0.00	{A,C}	2026-04-21 21:52:41.758808
11	Fleek	VAN_AMB	2	20.00	0.15	{C,F}	2026-04-21 22:50:26.69283
15	KSD 424	VAN_REF	2	30.00	0.52	{R}	2026-05-10 20:10:22.316802
\.


--
-- TOC entry 5427 (class 0 OID 65680)
-- Dependencies: 283
-- Data for Name: wh_items_damages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wh_items_damages (item_damage_id, item_id, damage_id, quantity_affected, discovered_at, detailed_description, photo_url, action_taken, reported_by_user_id) FROM stdin;
2	3	3	10	2026-04-18 08:48:00			quarantine	28
3	3	3	10	2026-04-18 09:00:00			quarantine	28
4	3	2	9	2026-04-18 09:00:00			held	28
5	3	1	1	2026-04-18 09:02:00			disposed	28
6	10	3	9	2026-05-07 14:14:00			held	28
7	10	4	2	2026-05-18 10:44:00			held	28
\.


--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 265
-- Name: cart_items_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_cart_id_seq', 61, true);


--
-- TOC entry 5464 (class 0 OID 0)
-- Dependencies: 228
-- Name: cfg_counties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_counties_id_seq', 6, true);


--
-- TOC entry 5465 (class 0 OID 0)
-- Dependencies: 224
-- Name: cfg_damage_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_damage_types_id_seq', 7, true);


--
-- TOC entry 5466 (class 0 OID 0)
-- Dependencies: 226
-- Name: cfg_hospital_departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_hospital_departments_id_seq', 15, true);


--
-- TOC entry 5467 (class 0 OID 0)
-- Dependencies: 219
-- Name: cfg_item_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_item_categories_id_seq', 7, true);


--
-- TOC entry 5468 (class 0 OID 0)
-- Dependencies: 251
-- Name: cfg_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_roles_id_seq', 4, true);


--
-- TOC entry 5469 (class 0 OID 0)
-- Dependencies: 241
-- Name: cfg_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_statuses_id_seq', 10, true);


--
-- TOC entry 5470 (class 0 OID 0)
-- Dependencies: 222
-- Name: cfg_uoms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_uoms_id_seq', 7, true);


--
-- TOC entry 5471 (class 0 OID 0)
-- Dependencies: 270
-- Name: cfg_vehicle_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_vehicle_categories_category_id_seq', 3, true);


--
-- TOC entry 5472 (class 0 OID 0)
-- Dependencies: 233
-- Name: cfg_warehouse_shelves_shelf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_warehouse_shelves_shelf_id_seq', 21, true);


--
-- TOC entry 5473 (class 0 OID 0)
-- Dependencies: 230
-- Name: cfg_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cfg_zones_id_seq', 17, true);


--
-- TOC entry 5474 (class 0 OID 0)
-- Dependencies: 263
-- Name: deliveries_delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deliveries_delivery_id_seq', 21, true);


--
-- TOC entry 5475 (class 0 OID 0)
-- Dependencies: 268
-- Name: delivery_issues_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.delivery_issues_issue_id_seq', 42, true);


--
-- TOC entry 5476 (class 0 OID 0)
-- Dependencies: 253
-- Name: drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_driver_id_seq', 25, true);


--
-- TOC entry 5477 (class 0 OID 0)
-- Dependencies: 247
-- Name: hospital_deactivation_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospital_deactivation_log_id_seq', 1, true);


--
-- TOC entry 5478 (class 0 OID 0)
-- Dependencies: 245
-- Name: hospital_department_mapping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospital_department_mapping_id_seq', 28, true);


--
-- TOC entry 5479 (class 0 OID 0)
-- Dependencies: 232
-- Name: hospital_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospital_id_seq', 41, true);


--
-- TOC entry 5480 (class 0 OID 0)
-- Dependencies: 243
-- Name: hospitals_hospital_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitals_hospital_id_seq', 22, true);


--
-- TOC entry 5481 (class 0 OID 0)
-- Dependencies: 278
-- Name: inbound_stock_delivery_note_number_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inbound_stock_delivery_note_number_seq', 20, true);


--
-- TOC entry 5482 (class 0 OID 0)
-- Dependencies: 280
-- Name: inbound_stock_items_inbound_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inbound_stock_items_inbound_item_id_seq', 34, true);


--
-- TOC entry 5483 (class 0 OID 0)
-- Dependencies: 277
-- Name: inbound_stock_stock_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inbound_stock_stock_batch_id_seq', 20, true);


--
-- TOC entry 5484 (class 0 OID 0)
-- Dependencies: 235
-- Name: items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_item_id_seq', 21, true);


--
-- TOC entry 5485 (class 0 OID 0)
-- Dependencies: 259
-- Name: order_packages_package_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_packages_package_id_seq', 43, true);


--
-- TOC entry 5486 (class 0 OID 0)
-- Dependencies: 257
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 30, true);


--
-- TOC entry 5487 (class 0 OID 0)
-- Dependencies: 261
-- Name: package_items_package_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_items_package_item_id_seq', 70, true);


--
-- TOC entry 5488 (class 0 OID 0)
-- Dependencies: 239
-- Name: request_items_request_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_items_request_item_id_seq', 67, true);


--
-- TOC entry 5489 (class 0 OID 0)
-- Dependencies: 249
-- Name: requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_request_id_seq', 19, true);


--
-- TOC entry 5490 (class 0 OID 0)
-- Dependencies: 237
-- Name: stock_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_log_log_id_seq', 12, true);


--
-- TOC entry 5491 (class 0 OID 0)
-- Dependencies: 255
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 33, true);


--
-- TOC entry 5492 (class 0 OID 0)
-- Dependencies: 272
-- Name: vehicle_assignments_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_assignments_assignment_id_seq', 14, true);


--
-- TOC entry 5493 (class 0 OID 0)
-- Dependencies: 275
-- Name: vehicles_vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_vehicle_id_seq', 16, true);


--
-- TOC entry 5494 (class 0 OID 0)
-- Dependencies: 282
-- Name: wh_items_damages_item_damage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wh_items_damages_item_damage_id_seq', 7, true);


--
-- TOC entry 5147 (class 2606 OID 32782)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 5091 (class 2606 OID 16444)
-- Name: cfg_counties cfg_counties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_counties
    ADD CONSTRAINT cfg_counties_name_key UNIQUE (name);


--
-- TOC entry 5093 (class 2606 OID 16442)
-- Name: cfg_counties cfg_counties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_counties
    ADD CONSTRAINT cfg_counties_pkey PRIMARY KEY (id);


--
-- TOC entry 5087 (class 2606 OID 16424)
-- Name: cfg_damage_types cfg_damage_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_damage_types
    ADD CONSTRAINT cfg_damage_types_pkey PRIMARY KEY (id);


--
-- TOC entry 5089 (class 2606 OID 16433)
-- Name: cfg_hospital_departments cfg_hospital_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_hospital_departments
    ADD CONSTRAINT cfg_hospital_departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5077 (class 2606 OID 16397)
-- Name: cfg_item_categories cfg_item_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_item_categories
    ADD CONSTRAINT cfg_item_categories_name_key UNIQUE (name);


--
-- TOC entry 5079 (class 2606 OID 16395)
-- Name: cfg_item_categories cfg_item_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_item_categories
    ADD CONSTRAINT cfg_item_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5149 (class 2606 OID 32927)
-- Name: cfg_receive_item_status cfg_receive_item_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_receive_item_status
    ADD CONSTRAINT cfg_receive_item_status_pkey PRIMARY KEY (id);


--
-- TOC entry 5125 (class 2606 OID 17109)
-- Name: cfg_roles cfg_roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_roles
    ADD CONSTRAINT cfg_roles_name_key UNIQUE (name);


--
-- TOC entry 5127 (class 2606 OID 17107)
-- Name: cfg_roles cfg_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_roles
    ADD CONSTRAINT cfg_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5111 (class 2606 OID 16857)
-- Name: cfg_statuses cfg_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_statuses
    ADD CONSTRAINT cfg_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 5113 (class 2606 OID 16859)
-- Name: cfg_statuses cfg_statuses_status_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_statuses
    ADD CONSTRAINT cfg_statuses_status_name_key UNIQUE (status_name);


--
-- TOC entry 5081 (class 2606 OID 16404)
-- Name: cfg_storage_options cfg_storage_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_storage_options
    ADD CONSTRAINT cfg_storage_options_pkey PRIMARY KEY (code);


--
-- TOC entry 5083 (class 2606 OID 16415)
-- Name: cfg_uoms cfg_uoms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_uoms
    ADD CONSTRAINT cfg_uoms_name_key UNIQUE (name);


--
-- TOC entry 5085 (class 2606 OID 16413)
-- Name: cfg_uoms cfg_uoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_uoms
    ADD CONSTRAINT cfg_uoms_pkey PRIMARY KEY (id);


--
-- TOC entry 5153 (class 2606 OID 49251)
-- Name: cfg_vehicle_categories cfg_vehicle_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_vehicle_categories
    ADD CONSTRAINT cfg_vehicle_categories_name_key UNIQUE (name);


--
-- TOC entry 5155 (class 2606 OID 49249)
-- Name: cfg_vehicle_categories cfg_vehicle_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_vehicle_categories
    ADD CONSTRAINT cfg_vehicle_categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 5159 (class 2606 OID 49324)
-- Name: cfg_vehicle_types cfg_vehicle_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_vehicle_types
    ADD CONSTRAINT cfg_vehicle_types_pkey PRIMARY KEY (type_code);


--
-- TOC entry 5099 (class 2606 OID 16577)
-- Name: cfg_warehouse_shelves cfg_warehouse_shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_warehouse_shelves
    ADD CONSTRAINT cfg_warehouse_shelves_pkey PRIMARY KEY (shelf_id);


--
-- TOC entry 5101 (class 2606 OID 16579)
-- Name: cfg_warehouse_shelves cfg_warehouse_shelves_shelf_label_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_warehouse_shelves
    ADD CONSTRAINT cfg_warehouse_shelves_shelf_label_key UNIQUE (shelf_label);


--
-- TOC entry 5095 (class 2606 OID 16458)
-- Name: cfg_zones cfg_zones_county_id_zone_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_zones
    ADD CONSTRAINT cfg_zones_county_id_zone_name_key UNIQUE (county_id, zone_name);


--
-- TOC entry 5097 (class 2606 OID 16456)
-- Name: cfg_zones cfg_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_zones
    ADD CONSTRAINT cfg_zones_pkey PRIMARY KEY (id);


--
-- TOC entry 5143 (class 2606 OID 24795)
-- Name: deliveries deliveries_package_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_package_id_key UNIQUE (package_id);


--
-- TOC entry 5145 (class 2606 OID 24793)
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (delivery_id);


--
-- TOC entry 5151 (class 2606 OID 32971)
-- Name: delivery_issues delivery_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_issues
    ADD CONSTRAINT delivery_issues_pkey PRIMARY KEY (issue_id);


--
-- TOC entry 5129 (class 2606 OID 17123)
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- TOC entry 5121 (class 2606 OID 16968)
-- Name: hospital_deactivation_log hospital_deactivation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_deactivation_log
    ADD CONSTRAINT hospital_deactivation_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5117 (class 2606 OID 16945)
-- Name: hospital_department_mapping hospital_department_mapping_hospital_id_department_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_department_mapping
    ADD CONSTRAINT hospital_department_mapping_hospital_id_department_id_key UNIQUE (hospital_id, department_id);


--
-- TOC entry 5119 (class 2606 OID 16943)
-- Name: hospital_department_mapping hospital_department_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_department_mapping
    ADD CONSTRAINT hospital_department_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 5115 (class 2606 OID 16926)
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (hospital_id);


--
-- TOC entry 5165 (class 2606 OID 65636)
-- Name: inbound_stock inbound_stock_delivery_note_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock
    ADD CONSTRAINT inbound_stock_delivery_note_number_key UNIQUE (delivery_note_number);


--
-- TOC entry 5169 (class 2606 OID 65663)
-- Name: inbound_stock_items inbound_stock_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock_items
    ADD CONSTRAINT inbound_stock_items_pkey PRIMARY KEY (inbound_item_id);


--
-- TOC entry 5167 (class 2606 OID 65634)
-- Name: inbound_stock inbound_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock
    ADD CONSTRAINT inbound_stock_pkey PRIMARY KEY (stock_batch_id);


--
-- TOC entry 5103 (class 2606 OID 16705)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);


--
-- TOC entry 5105 (class 2606 OID 16707)
-- Name: items items_sku_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_sku_code_key UNIQUE (sku_code);


--
-- TOC entry 5139 (class 2606 OID 24743)
-- Name: order_packages order_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages
    ADD CONSTRAINT order_packages_pkey PRIMARY KEY (package_id);


--
-- TOC entry 5135 (class 2606 OID 24724)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 5137 (class 2606 OID 24726)
-- Name: orders orders_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_request_id_key UNIQUE (request_id);


--
-- TOC entry 5141 (class 2606 OID 24773)
-- Name: package_items package_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items
    ADD CONSTRAINT package_items_pkey PRIMARY KEY (package_item_id);


--
-- TOC entry 5109 (class 2606 OID 16832)
-- Name: request_items request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT request_items_pkey PRIMARY KEY (request_item_id);


--
-- TOC entry 5123 (class 2606 OID 16985)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 5107 (class 2606 OID 16749)
-- Name: stock_log stock_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_log
    ADD CONSTRAINT stock_log_pkey PRIMARY KEY (log_id);


--
-- TOC entry 5131 (class 2606 OID 17152)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5133 (class 2606 OID 17150)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5157 (class 2606 OID 49305)
-- Name: vehicle_assignments vehicle_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 5161 (class 2606 OID 49338)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id);


--
-- TOC entry 5163 (class 2606 OID 49340)
-- Name: vehicles vehicles_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number);


--
-- TOC entry 5171 (class 2606 OID 65695)
-- Name: wh_items_damages wh_items_damages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_items_damages
    ADD CONSTRAINT wh_items_damages_pkey PRIMARY KEY (item_damage_id);


--
-- TOC entry 5215 (class 2620 OID 65720)
-- Name: items trg_sync_physical_boxes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sync_physical_boxes BEFORE UPDATE OF total_selling_units ON public.items FOR EACH ROW EXECUTE FUNCTION public.sync_physical_box_count();


--
-- TOC entry 5201 (class 2606 OID 32793)
-- Name: cart_items cart_items_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.cfg_hospital_departments(id);


--
-- TOC entry 5202 (class 2606 OID 32783)
-- Name: cart_items cart_items_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id);


--
-- TOC entry 5203 (class 2606 OID 32788)
-- Name: cart_items cart_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- TOC entry 5172 (class 2606 OID 16459)
-- Name: cfg_zones cfg_zones_county_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_zones
    ADD CONSTRAINT cfg_zones_county_id_fkey FOREIGN KEY (county_id) REFERENCES public.cfg_counties(id) ON DELETE CASCADE;


--
-- TOC entry 5204 (class 2606 OID 32972)
-- Name: delivery_issues delivery_issues_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_issues
    ADD CONSTRAINT delivery_issues_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(delivery_id);


--
-- TOC entry 5205 (class 2606 OID 32977)
-- Name: delivery_issues delivery_issues_request_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_issues
    ADD CONSTRAINT delivery_issues_request_item_id_fkey FOREIGN KEY (request_item_id) REFERENCES public.request_items(request_item_id);


--
-- TOC entry 5189 (class 2606 OID 73874)
-- Name: drivers drivers_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.vehicle_assignments(assignment_id);


--
-- TOC entry 5175 (class 2606 OID 16723)
-- Name: items fk_bulk_uom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_bulk_uom FOREIGN KEY (bulk_uom_id) REFERENCES public.cfg_uoms(id);


--
-- TOC entry 5176 (class 2606 OID 16708)
-- Name: items fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.cfg_item_categories(id);


--
-- TOC entry 5200 (class 2606 OID 24796)
-- Name: deliveries fk_delivery_package; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT fk_delivery_package FOREIGN KEY (package_id) REFERENCES public.order_packages(package_id);


--
-- TOC entry 5181 (class 2606 OID 16843)
-- Name: request_items fk_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES public.cfg_hospital_departments(id);


--
-- TOC entry 5190 (class 2606 OID 17126)
-- Name: drivers fk_driver_zone; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT fk_driver_zone FOREIGN KEY (preferred_zone_id) REFERENCES public.cfg_zones(id);


--
-- TOC entry 5186 (class 2606 OID 16969)
-- Name: hospital_deactivation_log fk_hospital; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_deactivation_log
    ADD CONSTRAINT fk_hospital FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id) ON DELETE CASCADE;


--
-- TOC entry 5193 (class 2606 OID 24727)
-- Name: orders fk_order_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_order_request FOREIGN KEY (request_id) REFERENCES public.requests(request_id);


--
-- TOC entry 5194 (class 2606 OID 24754)
-- Name: order_packages fk_package_clerk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages
    ADD CONSTRAINT fk_package_clerk FOREIGN KEY (assigned_clerk_id) REFERENCES public.users(user_id);


--
-- TOC entry 5195 (class 2606 OID 24759)
-- Name: order_packages fk_package_driver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages
    ADD CONSTRAINT fk_package_driver FOREIGN KEY (assigned_driver_id) REFERENCES public.drivers(driver_id);


--
-- TOC entry 5196 (class 2606 OID 24744)
-- Name: order_packages fk_package_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages
    ADD CONSTRAINT fk_package_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 5197 (class 2606 OID 24749)
-- Name: order_packages fk_package_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_packages
    ADD CONSTRAINT fk_package_status FOREIGN KEY (status_id) REFERENCES public.cfg_statuses(id);


--
-- TOC entry 5198 (class 2606 OID 24774)
-- Name: package_items fk_pi_package; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items
    ADD CONSTRAINT fk_pi_package FOREIGN KEY (package_id) REFERENCES public.order_packages(package_id);


--
-- TOC entry 5199 (class 2606 OID 24779)
-- Name: package_items fk_pi_request_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items
    ADD CONSTRAINT fk_pi_request_item FOREIGN KEY (request_item_id) REFERENCES public.request_items(request_item_id);


--
-- TOC entry 5177 (class 2606 OID 16728)
-- Name: items fk_selling_uom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_selling_uom FOREIGN KEY (selling_uom_id) REFERENCES public.cfg_uoms(id);


--
-- TOC entry 5178 (class 2606 OID 57431)
-- Name: items fk_shelf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_shelf FOREIGN KEY (shelf_id) REFERENCES public.cfg_warehouse_shelves(shelf_id) ON DELETE SET NULL;


--
-- TOC entry 5187 (class 2606 OID 16991)
-- Name: requests fk_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES public.cfg_statuses(id);


--
-- TOC entry 5173 (class 2606 OID 16580)
-- Name: cfg_warehouse_shelves fk_storage; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_warehouse_shelves
    ADD CONSTRAINT fk_storage FOREIGN KEY (storage_type_code) REFERENCES public.cfg_storage_options(code);


--
-- TOC entry 5179 (class 2606 OID 16713)
-- Name: items fk_storage_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_storage_type FOREIGN KEY (storage_temp_code) REFERENCES public.cfg_storage_options(code);


--
-- TOC entry 5174 (class 2606 OID 16585)
-- Name: cfg_warehouse_shelves fk_uom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cfg_warehouse_shelves
    ADD CONSTRAINT fk_uom FOREIGN KEY (bulk_uom_id) REFERENCES public.cfg_uoms(id);


--
-- TOC entry 5191 (class 2606 OID 17153)
-- Name: users fk_user_role_ref; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_role_ref FOREIGN KEY (role_id) REFERENCES public.cfg_roles(id);


--
-- TOC entry 5183 (class 2606 OID 16929)
-- Name: hospitals fk_zone; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT fk_zone FOREIGN KEY (zone_id) REFERENCES public.cfg_zones(id) ON DELETE RESTRICT;


--
-- TOC entry 5184 (class 2606 OID 16951)
-- Name: hospital_department_mapping hospital_department_mapping_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_department_mapping
    ADD CONSTRAINT hospital_department_mapping_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.cfg_hospital_departments(id) ON DELETE CASCADE;


--
-- TOC entry 5185 (class 2606 OID 16946)
-- Name: hospital_department_mapping hospital_department_mapping_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital_department_mapping
    ADD CONSTRAINT hospital_department_mapping_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id) ON DELETE CASCADE;


--
-- TOC entry 5210 (class 2606 OID 65674)
-- Name: inbound_stock_items inbound_stock_items_sku_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock_items
    ADD CONSTRAINT inbound_stock_items_sku_code_fkey FOREIGN KEY (sku_code) REFERENCES public.items(sku_code);


--
-- TOC entry 5211 (class 2606 OID 65664)
-- Name: inbound_stock_items inbound_stock_items_stock_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock_items
    ADD CONSTRAINT inbound_stock_items_stock_batch_id_fkey FOREIGN KEY (stock_batch_id) REFERENCES public.inbound_stock(stock_batch_id) ON DELETE CASCADE;


--
-- TOC entry 5209 (class 2606 OID 65637)
-- Name: inbound_stock inbound_stock_received_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbound_stock
    ADD CONSTRAINT inbound_stock_received_by_user_id_fkey FOREIGN KEY (received_by_user_id) REFERENCES public.users(user_id);


--
-- TOC entry 5182 (class 2606 OID 16838)
-- Name: request_items request_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_items
    ADD CONSTRAINT request_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- TOC entry 5188 (class 2606 OID 16986)
-- Name: requests requests_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id);


--
-- TOC entry 5180 (class 2606 OID 16750)
-- Name: stock_log stock_log_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_log
    ADD CONSTRAINT stock_log_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- TOC entry 5192 (class 2606 OID 32849)
-- Name: users users_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id);


--
-- TOC entry 5206 (class 2606 OID 49311)
-- Name: vehicle_assignments vehicle_assignments_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(driver_id);


--
-- TOC entry 5207 (class 2606 OID 49346)
-- Name: vehicles vehicles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.cfg_vehicle_categories(category_id);


--
-- TOC entry 5208 (class 2606 OID 49341)
-- Name: vehicles vehicles_type_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_type_code_fkey FOREIGN KEY (type_code) REFERENCES public.cfg_vehicle_types(type_code);


--
-- TOC entry 5212 (class 2606 OID 65701)
-- Name: wh_items_damages wh_items_damages_damage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_items_damages
    ADD CONSTRAINT wh_items_damages_damage_id_fkey FOREIGN KEY (damage_id) REFERENCES public.cfg_damage_types(id);


--
-- TOC entry 5213 (class 2606 OID 65696)
-- Name: wh_items_damages wh_items_damages_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_items_damages
    ADD CONSTRAINT wh_items_damages_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- TOC entry 5214 (class 2606 OID 65706)
-- Name: wh_items_damages wh_items_damages_reported_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wh_items_damages
    ADD CONSTRAINT wh_items_damages_reported_by_user_id_fkey FOREIGN KEY (reported_by_user_id) REFERENCES public.users(user_id);


-- Completed on 2026-06-27 08:50:05

--
-- PostgreSQL database dump complete
--

\unrestrict eDcJV9NqLTTW6hgVRT4jwWVHLHO85D1KjB9u4IITawh1Kdk9gI2Yitv09HhPMAU

