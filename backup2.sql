--
-- PostgreSQL database dump
--

\restrict 6tKWifzmT5CczuOanhsuqKJ0kKzYE0UgTirEvt9fFUoGnpoiSj8k9AT6ecClIv1

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

\unrestrict 6tKWifzmT5CczuOanhsuqKJ0kKzYE0UgTirEvt9fFUoGnpoiSj8k9AT6ecClIv1
\connect first_db
\restrict 6tKWifzmT5CczuOanhsuqKJ0kKzYE0UgTirEvt9fFUoGnpoiSj8k9AT6ecClIv1

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
    texte character varying(250)
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
    mark double precision NOT NULL
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
-- Name: reqclass; Type: TABLE; Schema: public; Owner: wilfried
--

CREATE TABLE public.reqclass (
    id integer NOT NULL,
    user_id integer NOT NULL,
    teacher_id integer NOT NULL,
    classe_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    mark double precision DEFAULT '1'::double precision NOT NULL
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
    is_active boolean DEFAULT true NOT NULL
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
    password character varying(50) NOT NULL,
    ville character varying(50) NOT NULL,
    quartier character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    role integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    phone character varying(15) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
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
-- Name: assclass id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass ALTER COLUMN id SET DEFAULT nextval('public.assclass_id_seq'::regclass);


--
-- Name: assub id; Type: DEFAULT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assub ALTER COLUMN id SET DEFAULT nextval('public.assub_id_seq'::regclass);


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

COPY public.commentaires (id, teacher_id, user_id, texte) FROM stdin;
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

COPY public.notations (id, teacher_id, user_id, mark) FROM stdin;
\.


--
-- Data for Name: reqclass; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.reqclass (id, user_id, teacher_id, classe_id, is_active, mark) FROM stdin;
1	1	1	1	t	1
9	6	6	1	t	1
10	1	7	2	t	1
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
-- Data for Name: subjets; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.subjets (id, name, enseignement_id) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.teachers (id, mark, user_id, is_active) FROM stdin;
1	1	2	t
2	1	3	t
3	1	4	t
4	1	5	t
6	1	8	t
7	1	9	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: wilfried
--

COPY public.users (id, username, password, ville, quartier, latitude, longitude, role, is_active, phone, created_at, updated_at) FROM stdin;
1	User1	########	Yaoundé	Mvan	3.86	11.515	0	t	679132064	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737
2	Teacher1	########	Yaoundé	Awae	3.8167	11.4833	1	t	690838146	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737
3	Teacher2	########	Yaoundé	Bastos	3.8667	11.5167	1	t	670395758	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737
4	Teacher3	########	Douala	Mboppi	4.06	9.71	1	t	676491024	2026-01-15 11:09:43.484737	2026-01-15 11:09:43.484737
5	prof_math	securepass	Douala	Bonapriso	4.0511	9.7679	1	t	237699999999	2026-01-15 13:38:05.409061	2026-01-15 13:38:05.409061
6	melen_user	melen123	Yaoundé	Melen	3.848	11.5021	0	t	237691234567	2026-01-15 13:41:02.139988	2026-01-15 13:41:02.139988
8	prof_melen	profmelen123	Yaoundé	Melen	3.848	11.5021	1	t	237692345678	2026-01-15 15:08:21.150519	2026-01-15 15:08:21.150519
9	mfoundi_tutor	mfoundi123	Yaoundé	Mfoundi	3.8667	11.5167	1	t	237696789012	2026-01-15 15:10:29.653481	2026-01-15 15:10:29.653481
\.


--
-- Name: assclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.assclass_id_seq', 8, true);


--
-- Name: assub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.assub_id_seq', 1, false);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.classes_id_seq', 3, true);


--
-- Name: commentaires_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.commentaires_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.notations_id_seq', 1, false);


--
-- Name: reqclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.reqclass_id_seq', 10, true);


--
-- Name: reqsub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.reqsub_id_seq', 1, false);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.sections_id_seq', 2, true);


--
-- Name: subjets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.subjets_id_seq', 1, false);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.teachers_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wilfried
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: teachers UQ_4668d4752e6766682d1be0b346f; Type: CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "UQ_4668d4752e6766682d1be0b346f" UNIQUE (user_id);


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
-- Name: assclass FK_5a3a9917e3f609965415a95d4dc; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.assclass
    ADD CONSTRAINT "FK_5a3a9917e3f609965415a95d4dc" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: reqclass FK_8b923574cd7a11ad94cc78fd493; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.reqclass
    ADD CONSTRAINT "FK_8b923574cd7a11ad94cc78fd493" FOREIGN KEY (classe_id) REFERENCES public.classes(id);


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
-- Name: commentaires commentaires_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT commentaires_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: commentaires commentaires_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wilfried
--

ALTER TABLE ONLY public.commentaires
    ADD CONSTRAINT commentaires_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


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

\unrestrict 6tKWifzmT5CczuOanhsuqKJ0kKzYE0UgTirEvt9fFUoGnpoiSj8k9AT6ecClIv1

