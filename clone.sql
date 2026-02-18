--
-- PostgreSQL database dump
--

\restrict FtG1Iy5BrOdfhObdrCezEjNBkgCOdggWgadV5cblKJYLfNJGXfncHdk7O7AZLh6

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

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

DROP DATABASE first_db;
--
-- Name: first_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE first_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


ALTER DATABASE first_db OWNER TO postgres;

\unrestrict FtG1Iy5BrOdfhObdrCezEjNBkgCOdggWgadV5cblKJYLfNJGXfncHdk7O7AZLh6
\connect first_db
\restrict FtG1Iy5BrOdfhObdrCezEjNBkgCOdggWgadV5cblKJYLfNJGXfncHdk7O7AZLh6

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
-- Name: Authers; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public."Authers" (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    identifiant character varying(255) NOT NULL
);


ALTER TABLE public."Authers" OWNER TO wilfried;

--
-- Name: Authers_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public."Authers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Authers_id_seq" OWNER TO wilfried;

--
-- Name: Authers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public."Authers_id_seq" OWNED BY public."Authers".id;


--
-- Name: assclass; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.assclass (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    classe_id integer NOT NULL
);


ALTER TABLE public.assclass OWNER TO wilfried;

--
-- Name: assclass_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.assclass_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assclass_id_seq OWNER TO wilfried;

--
-- Name: assclass_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.assclass_id_seq OWNED BY public.assclass.id;


--
-- Name: assub; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.assub (
    id integer NOT NULL,
    teacher_id integer,
    subjet_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE public.assub OWNER TO wilfried;

--
-- Name: assub_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.assub_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assub_id_seq OWNER TO wilfried;

--
-- Name: assub_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.assub_id_seq OWNED BY public.assub.id;


--
-- Name: authers; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.authers (
    id integer NOT NULL,
    identifiant character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    code character varying(6) NOT NULL
);


ALTER TABLE public.authers OWNER TO wilfried;

--
-- Name: authers_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.authers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authers_id_seq OWNER TO wilfried;

--
-- Name: authers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.authers_id_seq OWNED BY public.authers.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    enseignement_id integer NOT NULL
);


ALTER TABLE public.classes OWNER TO wilfried;

--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classes_id_seq OWNER TO wilfried;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: commentaires; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.commentaires (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    user_id integer NOT NULL,
    texte character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.commentaires OWNER TO wilfried;

--
-- Name: commentaires_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.commentaires_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commentaires_id_seq OWNER TO wilfried;

--
-- Name: commentaires_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.commentaires_id_seq OWNED BY public.commentaires.id;


--
-- Name: enseignements; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.enseignements (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    section_id integer NOT NULL
);


ALTER TABLE public.enseignements OWNER TO wilfried;

--
-- Name: enseignements_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.enseignements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enseignements_id_seq OWNER TO wilfried;

--
-- Name: enseignements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.enseignements_id_seq OWNED BY public.enseignements.id;


--
-- Name: exclass; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.exclass (
    id integer NOT NULL,
    user_id integer,
    teacher_id integer,
    classe_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE public.exclass OWNER TO wilfried;

--
-- Name: exclass_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.exclass_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exclass_id_seq OWNER TO wilfried;

--
-- Name: exclass_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.exclass_id_seq OWNED BY public.exclass.id;


--
-- Name: exsub; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.exsub (
    id integer NOT NULL,
    user_id integer,
    teacher_id integer,
    subjet_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE public.exsub OWNER TO wilfried;

--
-- Name: exsub_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.exsub_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exsub_id_seq OWNER TO wilfried;

--
-- Name: exsub_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.exsub_id_seq OWNED BY public.exsub.id;


--
-- Name: notations; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.notations (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    user_id integer NOT NULL,
    mark double precision NOT NULL,
    commentaire character varying(250),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notations OWNER TO wilfried;

--
-- Name: notations_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.notations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notations_id_seq OWNER TO wilfried;

--
-- Name: notations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.notations_id_seq OWNED BY public.notations.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token character varying NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public.refresh_tokens OWNER TO wilfried;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO wilfried;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: reqclass; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.reqclass (
    id integer NOT NULL,
    user_id integer NOT NULL,
    teacher_id integer NOT NULL,
    classe_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    status character varying(15),
    notation double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reqclass OWNER TO wilfried;

--
-- Name: reqclass_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.reqclass_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reqclass_id_seq OWNER TO wilfried;

--
-- Name: reqclass_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.reqclass_id_seq OWNED BY public.reqclass.id;


--
-- Name: reqsub; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.reqsub (
    id integer NOT NULL,
    user_id integer,
    teacher_id integer,
    subjet_id integer,
    is_active boolean DEFAULT true,
    status integer DEFAULT 0
);


ALTER TABLE public.reqsub OWNER TO wilfried;

--
-- Name: reqsub_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.reqsub_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reqsub_id_seq OWNER TO wilfried;

--
-- Name: reqsub_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.reqsub_id_seq OWNED BY public.reqsub.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.sections OWNER TO wilfried;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sections_id_seq OWNER TO wilfried;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: signaux; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.signaux (
    id integer NOT NULL,
    auteur integer NOT NULL,
    direction integer NOT NULL,
    motif character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.signaux OWNER TO wilfried;

--
-- Name: signaux_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.signaux_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.signaux_id_seq OWNER TO wilfried;

--
-- Name: signaux_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.signaux_id_seq OWNED BY public.signaux.id;


--
-- Name: subjets; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.subjets (
    id integer NOT NULL,
    name character varying(50),
    enseignement_id integer
);


ALTER TABLE public.subjets OWNER TO wilfried;

--
-- Name: subjets_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.subjets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subjets_id_seq OWNER TO wilfried;

--
-- Name: subjets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.subjets_id_seq OWNED BY public.subjets.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    mark double precision DEFAULT 1 NOT NULL,
    user_id integer NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    description character varying(250)
);


ALTER TABLE public.teachers OWNER TO wilfried;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teachers_id_seq OWNER TO wilfried;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    ville character varying(50) NOT NULL,
    quartier character varying(50) NOT NULL,
    latitude double precision DEFAULT '0'::double precision NOT NULL,
    longitude double precision DEFAULT '0'::double precision NOT NULL,
    role integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    phone character varying(15) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    fonction character varying(15) NOT NULL,
    path_image character varying(50) DEFAULT 'noPicture.jpg'::character varying NOT NULL,
    mail character varying(250),
    refresh_token character varying(250)
);


ALTER TABLE public.users OWNER TO wilfried;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO wilfried;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: verifications; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.verifications (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    path_document character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    description character varying(250)
);


ALTER TABLE public.verifications OWNER TO wilfried;

--
-- Name: verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: wilfried
--

CREATE SEQUENCE public.verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.verifications_id_seq OWNER TO wilfried;

--
-- Name: verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wilfried
--

ALTER SEQUENCE public.verifications_id_seq OWNED BY public.verifications.id;


--
-- Name: Authers id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public."Authers" ALTER COLUMN id SET DEFAULT nextval('public."Authers_id_seq"'::regclass);


--
-- Name: assclass id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass ALTER COLUMN id SET DEFAULT nextval('public.assclass_id_seq'::regclass);


--
-- Name: assub id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assub ALTER COLUMN id SET DEFAULT nextval('public.assub_id_seq'::regclass);


--
-- Name: authers id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.authers ALTER COLUMN id SET DEFAULT nextval('public.authers_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: commentaires id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires ALTER COLUMN id SET DEFAULT nextval('public.commentaires_id_seq'::regclass);


--
-- Name: enseignements id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.enseignements ALTER COLUMN id SET DEFAULT nextval('public.enseignements_id_seq'::regclass);


--
-- Name: exclass id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exclass ALTER COLUMN id SET DEFAULT nextval('public.exclass_id_seq'::regclass);


--
-- Name: exsub id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exsub ALTER COLUMN id SET DEFAULT nextval('public.exsub_id_seq'::regclass);


--
-- Name: notations id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.notations ALTER COLUMN id SET DEFAULT nextval('public.notations_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: reqclass id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass ALTER COLUMN id SET DEFAULT nextval('public.reqclass_id_seq'::regclass);


--
-- Name: reqsub id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqsub ALTER COLUMN id SET DEFAULT nextval('public.reqsub_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: signaux id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.signaux ALTER COLUMN id SET DEFAULT nextval('public.signaux_id_seq'::regclass);


--
-- Name: subjets id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.subjets ALTER COLUMN id SET DEFAULT nextval('public.subjets_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: verifications id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.verifications ALTER COLUMN id SET DEFAULT nextval('public.verifications_id_seq'::regclass);


--
-- Data for Name: Authers; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public."Authers" (id, code, identifiant) FROM stdin;
\.


--
-- Data for Name: assclass; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.assclass (id, teacher_id, classe_id) FROM stdin;
4	1	1
5	2	2
6	3	3
7	6	1
8	7	1
\.


--
-- Data for Name: assub; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.assub (id, teacher_id, subjet_id, is_active) FROM stdin;
\.


--
-- Data for Name: authers; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.authers (id, identifiant, expires_at, used, created_at, code) FROM stdin;
3	percylinkwe@gmail.com	2026-01-31 15:44:09.992	f	2026-01-31 15:41:09.993226	311088
4	percylin@gmail.com	2026-01-31 15:44:22.521	f	2026-01-31 15:41:22.522169	594449
2	bookup237@gmail.com	2026-02-02 13:23:15.307	f	2026-01-31 15:39:11.335743	874185
1	tcheutchouawilfried70@gmail.com	2026-02-02 15:52:49.765	t	2026-01-31 15:38:32.830726	165406
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.classes (id, name, enseignement_id) FROM stdin;
1	Seconde C	1
2	Terminale C	1
3	Premiere C	1
\.


--
-- Data for Name: commentaires; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.commentaires (id, teacher_id, user_id, texte, created_at) FROM stdin;
1	1	1	good teacher thank for all	2026-01-25 03:03:01.974421
3	1	1	Ceci est un commentaire de test	2026-01-25 03:59:33.586166
4	1	18	Très bon enseignant, pédagogue et ponctuel.	2026-02-08 00:06:17.987811
\.


--
-- Data for Name: enseignements; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.enseignements (id, name, section_id) FROM stdin;
1	general	1
2	technique	1
3	primaire	1
\.


--
-- Data for Name: exclass; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.exclass (id, user_id, teacher_id, classe_id, is_active) FROM stdin;
\.


--
-- Data for Name: exsub; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.exsub (id, user_id, teacher_id, subjet_id, is_active) FROM stdin;
\.


--
-- Data for Name: notations; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.notations (id, teacher_id, user_id, mark, commentaire, created_at, updated_at) FROM stdin;
1	1	18	4.5	Très bon tuteur, explications claires	2026-02-08 15:13:25.965687	2026-02-08 15:13:25.965687
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.refresh_tokens (id, token, "expiresAt", "userId") FROM stdin;
\.


--
-- Data for Name: reqclass; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.reqclass (id, user_id, teacher_id, classe_id, is_active, status, notation, created_at, updated_at) FROM stdin;
9	6	6	1	t	pending	3	2026-01-23 21:22:33.213217	2026-01-25 00:30:51.231186
10	1	7	2	t	pending	3	2026-01-23 21:22:33.213217	2026-01-25 00:30:51.231186
1	1	1	1	t	accepted	3	2026-01-23 21:22:33.213217	2026-01-25 00:39:52.999
11	1	6	2	t	\N	\N	2026-02-06 14:47:27.181521	2026-02-06 14:47:27.181521
12	1	6	2	t	\N	\N	2026-02-06 14:54:06.722726	2026-02-06 14:54:06.722726
13	1	6	2	t	pending	0	2026-02-06 14:56:17.224396	2026-02-06 14:56:17.224396
\.


--
-- Data for Name: reqsub; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.reqsub (id, user_id, teacher_id, subjet_id, is_active, status) FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.sections (id, name) FROM stdin;
1	francophone
2	anglophone
\.


--
-- Data for Name: signaux; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.signaux (id, auteur, direction, motif, created_at) FROM stdin;
\.


--
-- Data for Name: subjets; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.subjets (id, name, enseignement_id) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.teachers (id, mark, user_id, is_active, description) FROM stdin;
2	1	3	t	\N
3	1	4	t	\N
4	1	5	t	\N
6	1	8	t	\N
7	1	9	t	\N
8	1	15	f	\N
9	1	16	f	\N
1	4.5	2	t	\N
10	1	19	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.users (id, username, password, ville, quartier, latitude, longitude, role, is_active, phone, created_at, updated_at, fonction, path_image, mail, refresh_token) FROM stdin;
2	Teacher1	########	Yaoundé	Awae	3.8167	11.4833	1	t	690838146	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737	tutor	noPicture.jpg	\N	\N
3	Teacher2	########	Yaoundé	Bastos	3.8667	11.5167	1	t	670395758	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737	tutor	noPicture.jpg	\N	\N
4	Teacher3	########	Douala	Mboppi	4.06	9.71	1	t	676491024	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737	tutor	noPicture.jpg	\N	\N
5	prof_math	securepass	Douala	Bonapriso	4.0511	9.7679	1	t	237699999999	2026-01-15 13:38:05.409061	2026-01-15 13:38:05.409061	tutor	noPicture.jpg	\N	\N
8	prof_melen	profmelen123	Yaoundé	Melen	3.848	11.5021	1	t	237692345678	2026-01-15 15:08:21.150519	2026-01-15 15:08:21.150519	tutor	noPicture.jpg	\N	\N
9	mfoundi_tutor	mfoundi123	Yaoundé	Mfoundi	3.8667	11.5167	1	t	237696789012	2026-01-15 15:10:29.653481	2026-01-15 15:10:29.653481	tutor	noPicture.jpg	\N	\N
20	Admin	$2b$10$3bL1Ln8Dgx5AJfylAO/ur.a3pDkT06hnsbFy4RXZz4GHCMlIqUUc.	Douala	Bonapriso	0	0	2	t	699985125	2026-02-09 23:19:28.945571	2026-02-09 23:22:03.436897	admin	noPicture.jpg	admin@exemple.com	$2b$10$wcctddL8HG9BDph2wWjA/eW.aVPum1YINeakA4NTk8Gv4m3.T8H/K
6	melen_user	melen123	Yaoundé	Melen	3.848	11.5021	0	t	237691234567	2026-01-15 13:41:02.139988	2026-01-15 13:41:02.139988	parent	noPicture.jpg	\N	\N
1	User1	########	Yaoundé	Mvan	3.86	11.515	0	t	679132064	2026-01-15 11:09:43.484737	2026-01-26 11:04:36.024539	parent	profile_545144bd-fbf3-43db-bc67-ab512f1e762b.jpg	\N	\N
14	parent_awae	$2b$10$E.fUvPn6wEe5lDqWw9SeOuk1FfdbFJ6r1JRgMOy89rnrDIbuJXiYG	Yaoundé	Awae Escalier	3.848	11.5021	0	t	+237679132064	2026-01-29 04:15:05.140237	2026-01-29 04:15:05.140237	parent	noPicture.jpg	parent.awae@gmail.com	\N
15	tutor_nkomo	$2b$10$C7rpAjq2WT8aMtDhVvydH.HKoA9tq0OlvdBbfyR3525yf5m1XFB5i	Yaoundé	Nkomo	3.8903	11.4974	1	t	+237690838146	2026-01-29 04:21:03.525972	2026-01-29 04:21:03.525972	tutor	noPicture.jpg	tutor.nkomo@gmail.com	\N
16	ProfScience	$2b$10$kj89L17gLufJ6gIzYnFpXOczr0.OA54gCOsoJeEvcof6DGxDhDpfe	Douala	Akwa	0	0	1	t	644444444	2026-02-02 13:07:09.305983	2026-02-02 13:07:09.305983	tutor	noPicture.jpg	science@example.com	\N
17	JaneDoe	$2b$10$1suiVoBzSBlpD0IxLxd0XeP1wSxPgMTq.x8MTCHklcDspH92vUfmi	Douala	Bonapriso	0	0	0	t	677777777	2026-02-02 14:55:52.145478	2026-02-02 14:55:52.145478	parent	noPicture.jpg	jane@example.com	\N
18	Parent Test	$2b$10$h5zx/DFMbSepw2CzSmjxs.Qz.tgs7frZlHSqylCNv6yGQjwmOF9eK	Douala	Akwa	0	0	0	t	690000000	2026-02-04 22:45:20.93862	2026-02-08 14:36:46.544823	parent	noPicture.jpg	parent@gmail.com	$2b$10$ki5Y7ik6I38zw/6xDaZRFOB1YxOOESgxyPwvWJmZ.69D5p3itJNk2
19	wilfried	$2b$10$/r15eFqOwnCu3pezKK354.Qwo6RqntivJFml0JNBsXVIbx9NsCSZ6	Douala	Bonapriso	0	0	1	t	690859025	2026-02-09 12:11:01.208576	2026-02-09 12:23:55.28136	tutor	noPicture.jpg	this@gmail.com	$2b$10$aOSkmxjXlu8/8jzjGJRLZuUjqT4mpNOG46IwgSc.pIYSKAVa3ci5i
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.verifications (id, teacher_id, created_at, updated_at, path_document, status, description) FROM stdin;
3	1	2026-01-26 18:40:59.200896	2026-01-26 18:40:59.200896	verif_1_1769449259189_bc8dc6bc-169b-4a85-9fa9-3cd0e57bd1f6.pdf	pending	\N
\.


--
-- Name: Authers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public."Authers_id_seq"', 1, false);


--
-- Name: assclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.assclass_id_seq', 8, true);


--
-- Name: assub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.assub_id_seq', 1, false);


--
-- Name: authers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.authers_id_seq', 4, true);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.classes_id_seq', 3, true);


--
-- Name: commentaires_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.commentaires_id_seq', 4, true);


--
-- Name: enseignements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.enseignements_id_seq', 3, true);


--
-- Name: exclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.exclass_id_seq', 1, false);


--
-- Name: exsub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.exsub_id_seq', 1, false);


--
-- Name: notations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.notations_id_seq', 1, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, false);


--
-- Name: reqclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.reqclass_id_seq', 13, true);


--
-- Name: reqsub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.reqsub_id_seq', 1, false);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.sections_id_seq', 2, true);


--
-- Name: signaux_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.signaux_id_seq', 1, false);


--
-- Name: subjets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.subjets_id_seq', 1, false);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.teachers_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.users_id_seq', 20, true);


--
-- Name: verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.verifications_id_seq', 3, true);


--
-- Name: refresh_tokens PK_7d8bee0204106019488c4c50ffa; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);


--
-- Name: signaux PK_97162c00bdc9301eac5ef3a9ef1; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.signaux
    ADD CONSTRAINT "PK_97162c00bdc9301eac5ef3a9ef1" PRIMARY KEY (id);


--
-- Name: Authers PK_b200205ecb92338be5bf0f12738; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public."Authers"
    ADD CONSTRAINT "PK_b200205ecb92338be5bf0f12738" PRIMARY KEY (id);


--
-- Name: teachers UQ_4668d4752e6766682d1be0b346f; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "UQ_4668d4752e6766682d1be0b346f" UNIQUE (user_id);


--
-- Name: assclass UQ_assclass_teacher_classe; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass
    ADD CONSTRAINT "UQ_assclass_teacher_classe" UNIQUE (teacher_id, classe_id);


--
-- Name: assclass assclass_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass
    ADD CONSTRAINT assclass_pkey PRIMARY KEY (id);


--
-- Name: assub assub_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assub
    ADD CONSTRAINT assub_pkey PRIMARY KEY (id);


--
-- Name: authers authers_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.authers
    ADD CONSTRAINT authers_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: commentaires commentaires_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT commentaires_pkey PRIMARY KEY (id);


--
-- Name: enseignements enseignements_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.enseignements
    ADD CONSTRAINT enseignements_pkey PRIMARY KEY (id);


--
-- Name: exclass exclass_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exclass
    ADD CONSTRAINT exclass_pkey PRIMARY KEY (id);


--
-- Name: exsub exsub_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exsub
    ADD CONSTRAINT exsub_pkey PRIMARY KEY (id);


--
-- Name: notations notations_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.notations
    ADD CONSTRAINT notations_pkey PRIMARY KEY (id);


--
-- Name: reqclass reqclass_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass
    ADD CONSTRAINT reqclass_pkey PRIMARY KEY (id);


--
-- Name: reqsub reqsub_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqsub
    ADD CONSTRAINT reqsub_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: subjets subjets_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.subjets
    ADD CONSTRAINT subjets_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: IDX_de85fdb10b5418a6779de5079f; Type: INDEX; Schema: public; Owner: wilfried
--

CREATE UNIQUE INDEX "IDX_de85fdb10b5418a6779de5079f" ON public.signaux USING btree (auteur, direction);


--
-- Name: notations FK_14e0e76dd48c0796bed517f97b5; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.notations
    ADD CONSTRAINT "FK_14e0e76dd48c0796bed517f97b5" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teachers FK_4668d4752e6766682d1be0b346f; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "FK_4668d4752e6766682d1be0b346f" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: signaux FK_494bd1eef78ffba499163e8e746; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.signaux
    ADD CONSTRAINT "FK_494bd1eef78ffba499163e8e746" FOREIGN KEY (auteur) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: assclass FK_5a3a9917e3f609965415a95d4dc; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass
    ADD CONSTRAINT "FK_5a3a9917e3f609965415a95d4dc" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: refresh_tokens FK_610102b60fea1455310ccd299de; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reqclass FK_8b923574cd7a11ad94cc78fd493; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass
    ADD CONSTRAINT "FK_8b923574cd7a11ad94cc78fd493" FOREIGN KEY (classe_id) REFERENCES public.classes(id);


--
-- Name: commentaires FK_93c13ecf4668482adf51a34e518; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT "FK_93c13ecf4668482adf51a34e518" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: signaux FK_99ed80259cf3bcb3f41b28ab651; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.signaux
    ADD CONSTRAINT "FK_99ed80259cf3bcb3f41b28ab651" FOREIGN KEY (direction) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: verifications FK_9aae27ef4ecdaf56b9f45e18efc; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT "FK_9aae27ef4ecdaf56b9f45e18efc" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: reqclass FK_a4faf0510fc09c5ea28ee41d444; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass
    ADD CONSTRAINT "FK_a4faf0510fc09c5ea28ee41d444" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notations FK_ab1a32b0eb26e89213c54ed3ea8; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.notations
    ADD CONSTRAINT "FK_ab1a32b0eb26e89213c54ed3ea8" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: commentaires FK_b992d475ecdcad00e097e8cb52a; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT "FK_b992d475ecdcad00e097e8cb52a" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: assclass FK_cb8f372787d74ff4587fb418507; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass
    ADD CONSTRAINT "FK_cb8f372787d74ff4587fb418507" FOREIGN KEY (classe_id) REFERENCES public.classes(id);


--
-- Name: reqclass FK_ff735ca7b40c23a6e5fa22507ec; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass
    ADD CONSTRAINT "FK_ff735ca7b40c23a6e5fa22507ec" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: assub assub_subjet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assub
    ADD CONSTRAINT assub_subjet_id_fkey FOREIGN KEY (subjet_id) REFERENCES public.subjets(id) ON DELETE CASCADE;


--
-- Name: assub assub_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assub
    ADD CONSTRAINT assub_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: exclass exclass_classe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exclass
    ADD CONSTRAINT exclass_classe_id_fkey FOREIGN KEY (classe_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: exclass exclass_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exclass
    ADD CONSTRAINT exclass_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: exclass exclass_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exclass
    ADD CONSTRAINT exclass_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: exsub exsub_subjet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exsub
    ADD CONSTRAINT exsub_subjet_id_fkey FOREIGN KEY (subjet_id) REFERENCES public.subjets(id) ON DELETE CASCADE;


--
-- Name: exsub exsub_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exsub
    ADD CONSTRAINT exsub_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: exsub exsub_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.exsub
    ADD CONSTRAINT exsub_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reqsub reqsub_subjet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqsub
    ADD CONSTRAINT reqsub_subjet_id_fkey FOREIGN KEY (subjet_id) REFERENCES public.subjets(id) ON DELETE CASCADE;


--
-- Name: reqsub reqsub_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqsub
    ADD CONSTRAINT reqsub_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: reqsub reqsub_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqsub
    ADD CONSTRAINT reqsub_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subjets subjets_enseignement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.subjets
    ADD CONSTRAINT subjets_enseignement_id_fkey FOREIGN KEY (enseignement_id) REFERENCES public.enseignements(id) ON DELETE CASCADE;


--
-- Name: DATABASE first_db; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE first_db TO wilfried;


--
-- PostgreSQL database dump complete
--

\unrestrict FtG1Iy5BrOdfhObdrCezEjNBkgCOdggWgadV5cblKJYLfNJGXfncHdk7O7AZLh6

