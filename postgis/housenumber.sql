--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg110+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-29 15:50:47 +07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3331 (class 1262 OID 16395)
-- Name: housenumber; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE housenumber WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE housenumber OWNER TO postgres;

\connect housenumber

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- TOC entry 216 (class 1259 OID 16397)
-- Name: survey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey (
    gid integer NOT NULL,
    mncptname text,
    moo numeric,
    hno text,
    lat numeric,
    lng numeric
);


ALTER TABLE public.survey OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16396)
-- Name: survey_gid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.survey_gid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.survey_gid_seq OWNER TO postgres;

--
-- TOC entry 3332 (class 0 OID 0)
-- Dependencies: 215
-- Name: survey_gid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.survey_gid_seq OWNED BY public.survey.gid;


--
-- TOC entry 3180 (class 2604 OID 16400)
-- Name: survey gid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey ALTER COLUMN gid SET DEFAULT nextval('public.survey_gid_seq'::regclass);


--
-- TOC entry 3325 (class 0 OID 16397)
-- Dependencies: 216
-- Data for Name: survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (1, 'ทต.เวียงยอง', NULL, '209/23', 18.779733811339312, 98.98441314697267) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (2, 'ทต.เวียงยอง', 4, '444', 18.765920100247016, 99.00192260742189) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (3, 'ทต.เวียงยอง', 4, 'ee', 18.756630757443535, 98.97462844848634) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (4, 'ทต.เวียงยอง', 4, '55', 18.76402770825767, 98.9575481414795) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (5, 'ทต.เวียงยอง', 4, '66', 18.80241839887061, 99.02853012084962) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (6, 'ทต.เวียงยอง', 0, 'yy', 18.764592582591277, 99.01084899902345) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (7, 'ทต.เวียงยอง', 7, 'uu', 18.79841073529184, 98.99488449096681) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (8, 'ทต.เวียงยอง', 4, 'ff', 18.803786659164306, 99.05651092529297) ON CONFLICT DO NOTHING;
INSERT INTO public.survey (gid, mncptname, moo, hno, lat, lng) VALUES (9, 'ทต.เวียงยอง', 99, '9999999', 18.72221916670295, 98.96652415394784) ON CONFLICT DO NOTHING;


--
-- TOC entry 3333 (class 0 OID 0)
-- Dependencies: 215
-- Name: survey_gid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.survey_gid_seq', 9, true);


-- Completed on 2024-10-29 15:50:47 +07

--
-- PostgreSQL database dump complete
--

