--
-- PostgreSQL database dump
--

-- Dumped from database version 11.13
-- Dumped by pg_dump version 16.3

-- Started on 2026-01-04 19:21:30

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
-- TOC entry 8 (class 2615 OID 40072)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 2 (class 3079 OID 40344)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

--
-- TOC entry 209 (class 1259 OID 40169)
-- Name: colheita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colheita (
    id bigint NOT NULL,
    cultivo_id bigint NOT NULL,
    data_colheita date NOT NULL,
    quantidade_colhida numeric(10,2),
    qualidade_produto character varying(255),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.colheita OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 40167)
-- Name: colheita_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colheita_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colheita_id_seq OWNER TO postgres;

--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 208
-- Name: colheita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colheita_id_seq OWNED BY public.colheita.id;


--
-- TOC entry 219 (class 1259 OID 40236)
-- Name: contas_pagar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contas_pagar (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    cliente_id bigint NOT NULL,
    fornecedor_id bigint NOT NULL,
    descricao character varying(255) NOT NULL,
    valor numeric(10,2) NOT NULL,
    data_vencimento date NOT NULL,
    data_pagamento date,
    pago boolean DEFAULT false,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_pagar OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 40234)
-- Name: contas_pagar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contas_pagar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contas_pagar_id_seq OWNER TO postgres;

--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 218
-- Name: contas_pagar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contas_pagar_id_seq OWNED BY public.contas_pagar.id;


--
-- TOC entry 221 (class 1259 OID 40271)
-- Name: contas_receber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contas_receber (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    cliente_id bigint NOT NULL,
    pessoa_id bigint NOT NULL,
    produto_id bigint,
    descricao character varying(255) NOT NULL,
    valor numeric(10,2) NOT NULL,
    data_prevista date NOT NULL,
    data_recebimento date,
    recebido boolean DEFAULT false,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_receber OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 40269)
-- Name: contas_receber_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contas_receber_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contas_receber_id_seq OWNER TO postgres;

--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 220
-- Name: contas_receber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contas_receber_id_seq OWNED BY public.contas_receber.id;


--
-- TOC entry 203 (class 1259 OID 40118)
-- Name: cultivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cultivo (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    nome_cultivo character varying(255) NOT NULL,
    tipo_cultivo character varying(255),
    area_cultivo numeric(10,2),
    data_plantio date,
    previsao_colheita date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cultivo OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 40116)
-- Name: cultivo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cultivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cultivo_id_seq OWNER TO postgres;

--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 202
-- Name: cultivo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cultivo_id_seq OWNED BY public.cultivo.id;


--
-- TOC entry 197 (class 1259 OID 40073)
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 40200)
-- Name: indicador_sustentabilidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.indicador_sustentabilidade (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    tipo_indicador character varying(255) NOT NULL,
    valor_indicador numeric(10,2),
    unidade_medida character varying(50),
    data_checagem date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.indicador_sustentabilidade OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 40198)
-- Name: indicador_sustentabilidade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.indicador_sustentabilidade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.indicador_sustentabilidade_id_seq OWNER TO postgres;

--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 212
-- Name: indicador_sustentabilidade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.indicador_sustentabilidade_id_seq OWNED BY public.indicador_sustentabilidade.id;


--
-- TOC entry 207 (class 1259 OID 40152)
-- Name: insumo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insumo (
    id bigint NOT NULL,
    cultivo_id bigint NOT NULL,
    nome_insumo character varying(255) NOT NULL,
    tipo_insumo character varying(255),
    quantidade numeric(10,2),
    custo_unitario numeric(10,2),
    data_utilizacao date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.insumo OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 40150)
-- Name: insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insumo_id_seq OWNER TO postgres;

--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 206
-- Name: insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insumo_id_seq OWNED BY public.insumo.id;


--
-- TOC entry 215 (class 1259 OID 40214)
-- Name: pessoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pessoa (
    id bigint NOT NULL,
    nome_razao character varying(255) NOT NULL,
    tipo_pessoa character varying(20) NOT NULL,
    cpf_cnpj character varying(20) NOT NULL,
    telefone character varying(50),
    email character varying(255),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pessoa OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 40212)
-- Name: pessoa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pessoa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pessoa_id_seq OWNER TO postgres;

--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 214
-- Name: pessoa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pessoa_id_seq OWNED BY public.pessoa.id;


--
-- TOC entry 222 (class 1259 OID 40309)
-- Name: pessoa_propriedade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pessoa_propriedade (
    pessoa_id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    id bigint NOT NULL,
    tipo_relacao character varying(1) NOT NULL,
    tipo_vinculo character varying(30)
);


ALTER TABLE public.pessoa_propriedade OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 40331)
-- Name: pessoa_propriedade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pessoa_propriedade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pessoa_propriedade_id_seq OWNER TO postgres;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 223
-- Name: pessoa_propriedade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pessoa_propriedade_id_seq OWNED BY public.pessoa_propriedade.id;


--
-- TOC entry 233 (class 1259 OID 40551)
-- Name: pmo_acesso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_acesso (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    roteiro_acesso text
);


ALTER TABLE public.pmo_acesso OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 40549)
-- Name: pmo_acesso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_acesso_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_acesso_id_seq OWNER TO postgres;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 232
-- Name: pmo_acesso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_acesso_id_seq OWNED BY public.pmo_acesso.id;


--
-- TOC entry 241 (class 1259 OID 40619)
-- Name: pmo_agua; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_agua (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    fonte_acude boolean,
    fonte_corrego_rio boolean,
    fonte_corrego_nome character varying(120),
    fonte_poco boolean,
    fonte_riacho boolean,
    fonte_cisterna boolean,
    fonte_outros character varying(120),
    irrigacao_aspersao boolean,
    irrigacao_microaspersao boolean,
    irrigacao_gotejamento boolean,
    irrigacao_bombeamento boolean,
    irrigacao_gravidade boolean,
    irrigacao_sulcos boolean,
    irrigacao_nenhum boolean,
    analise_agua_feita boolean,
    condicoes_analise text,
    risco_contaminacao_agua boolean,
    risco_contaminacao_agua_desc text,
    acoes_qualidade_agua text
);


ALTER TABLE public.pmo_agua OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 40617)
-- Name: pmo_agua_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_agua_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_agua_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 240
-- Name: pmo_agua_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_agua_id_seq OWNED BY public.pmo_agua.id;


--
-- TOC entry 279 (class 1259 OID 40942)
-- Name: pmo_anexo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_anexo (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    tipo character varying(30) NOT NULL,
    nome_arquivo character varying(255),
    mime_type character varying(120),
    uri text NOT NULL,
    descricao text,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pmo_anexo OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 40940)
-- Name: pmo_anexo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_anexo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_anexo_id_seq OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 278
-- Name: pmo_anexo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_anexo_id_seq OWNED BY public.pmo_anexo.id;


--
-- TOC entry 253 (class 1259 OID 40723)
-- Name: pmo_animais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_animais (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    possui_animais boolean,
    quais text,
    alimentacao text,
    tratamento_doencas text,
    mantem_presos boolean,
    circulam_livre boolean,
    liberdade_outro text,
    oferecem_risco_contaminacao boolean,
    mitigacao_risco text
);


ALTER TABLE public.pmo_animais OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 40721)
-- Name: pmo_animais_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_animais_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_animais_id_seq OWNER TO postgres;

--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 252
-- Name: pmo_animais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_animais_id_seq OWNED BY public.pmo_animais.id;


--
-- TOC entry 231 (class 1259 OID 40536)
-- Name: pmo_area_resumo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_area_resumo (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    total_assentamento_m2 numeric(14,2),
    area_manejo_organico_m2 numeric(14,2),
    reserva_legal_m2 numeric(14,2),
    area_producao_paralela_m2 numeric(14,2),
    area_estruturas_moradias_m2 numeric(14,2)
);


ALTER TABLE public.pmo_area_resumo OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 40534)
-- Name: pmo_area_resumo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_area_resumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_area_resumo_id_seq OWNER TO postgres;

--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 230
-- Name: pmo_area_resumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_area_resumo_id_seq OWNED BY public.pmo_area_resumo.id;


--
-- TOC entry 273 (class 1259 OID 40888)
-- Name: pmo_armazenamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_armazenamento (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    locais_organicos text,
    locais_nao_organicos text
);


ALTER TABLE public.pmo_armazenamento OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 40886)
-- Name: pmo_armazenamento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_armazenamento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_armazenamento_id_seq OWNER TO postgres;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 272
-- Name: pmo_armazenamento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_armazenamento_id_seq OWNED BY public.pmo_armazenamento.id;


--
-- TOC entry 245 (class 1259 OID 40655)
-- Name: pmo_biodiversidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_biodiversidade (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    consorcio boolean,
    recuperacao_apps boolean,
    rotacao_cultura boolean,
    quebra_vento boolean,
    sem_fogo boolean,
    faixas_anti_erosao boolean,
    curva_nivel boolean,
    reserva_legal boolean,
    plantio_direto boolean,
    adubacao_organica boolean,
    adubacao_verde boolean,
    cobertura_solo boolean,
    safs boolean,
    outros text
);


ALTER TABLE public.pmo_biodiversidade OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 40653)
-- Name: pmo_biodiversidade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_biodiversidade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_biodiversidade_id_seq OWNER TO postgres;

--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 244
-- Name: pmo_biodiversidade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_biodiversidade_id_seq OWNED BY public.pmo_biodiversidade.id;


--
-- TOC entry 277 (class 1259 OID 40924)
-- Name: pmo_comercializacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_comercializacao (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    venda_direta_feiras boolean,
    venda_direta_feiras_quais text,
    venda_entrega_domicilio boolean,
    venda_cestas boolean,
    venda_outra text,
    venda_governo_paa boolean,
    venda_governo_pnae boolean,
    revenda_pequeno_varejo boolean,
    revenda_supermercado_bairro boolean,
    revenda_rede_supermercado boolean,
    revenda_intermediario boolean,
    rastreabilidade_desc text,
    mao_de_obra_regular boolean,
    mao_de_obra_qtd_pessoas integer,
    mao_de_obra_horas_semana integer,
    relacao_trabalhista character varying(40),
    assistencia_tecnica boolean,
    assistencia_tecnica_quem text,
    assistencia_tecnica_frequencia text
);


ALTER TABLE public.pmo_comercializacao OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 40922)
-- Name: pmo_comercializacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_comercializacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_comercializacao_id_seq OWNER TO postgres;

--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 276
-- Name: pmo_comercializacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_comercializacao_id_seq OWNED BY public.pmo_comercializacao.id;


--
-- TOC entry 247 (class 1259 OID 40673)
-- Name: pmo_controles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_controles (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    como_registra_producao_venda text,
    controle_por_lote boolean,
    controle_por_data_colheita boolean,
    controle_declaracao_transacao boolean,
    controle_nota_recibo boolean,
    controle_outros text,
    controle_origem_entrada text,
    origem_nota_fiscal boolean,
    origem_recibo boolean,
    origem_registro_interno boolean,
    origem_outros text
);


ALTER TABLE public.pmo_controles OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 40671)
-- Name: pmo_controles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_controles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_controles_id_seq OWNER TO postgres;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 246
-- Name: pmo_controles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_controles_id_seq OWNED BY public.pmo_controles.id;


--
-- TOC entry 255 (class 1259 OID 40741)
-- Name: pmo_cultivo_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_cultivo_item (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    tipo character varying(20) NOT NULL,
    categoria character varying(30),
    produto_especie_variedade character varying(200) NOT NULL,
    area_valor numeric(14,2),
    area_unidade character varying(10),
    estimativa_anual character varying(120),
    observacao text
);


ALTER TABLE public.pmo_cultivo_item OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 40739)
-- Name: pmo_cultivo_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_cultivo_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_cultivo_item_id_seq OWNER TO postgres;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 254
-- Name: pmo_cultivo_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_cultivo_item_id_seq OWNED BY public.pmo_cultivo_item.id;


--
-- TOC entry 251 (class 1259 OID 40707)
-- Name: pmo_equipamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_equipamento (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    especificacao character varying(200) NOT NULL,
    tempo_meses integer,
    estado character varying(40),
    observacao text
);


ALTER TABLE public.pmo_equipamento OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 40705)
-- Name: pmo_equipamento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_equipamento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_equipamento_id_seq OWNER TO postgres;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 250
-- Name: pmo_equipamento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_equipamento_id_seq OWNED BY public.pmo_equipamento.id;


--
-- TOC entry 249 (class 1259 OID 40691)
-- Name: pmo_estrutura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_estrutura (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    nome character varying(200) NOT NULL,
    tempo_meses integer,
    estado character varying(40),
    observacao text
);


ALTER TABLE public.pmo_estrutura OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 40689)
-- Name: pmo_estrutura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_estrutura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_estrutura_id_seq OWNER TO postgres;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 248
-- Name: pmo_estrutura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_estrutura_id_seq OWNED BY public.pmo_estrutura.id;


--
-- TOC entry 259 (class 1259 OID 40776)
-- Name: pmo_insumo_adubacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_insumo_adubacao (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    substancia character varying(200) NOT NULL,
    marca_nome_comercial character varying(200),
    cultura_area character varying(200),
    quantidade_dose character varying(200)
);


ALTER TABLE public.pmo_insumo_adubacao OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 40774)
-- Name: pmo_insumo_adubacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_insumo_adubacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_insumo_adubacao_id_seq OWNER TO postgres;

--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 258
-- Name: pmo_insumo_adubacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_insumo_adubacao_id_seq OWNED BY public.pmo_insumo_adubacao.id;


--
-- TOC entry 261 (class 1259 OID 40792)
-- Name: pmo_insumo_defensivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_insumo_defensivo (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    substancia character varying(200) NOT NULL,
    marca_nome_comercial character varying(200),
    cultura_area character varying(200),
    quantidade_dose character varying(200)
);


ALTER TABLE public.pmo_insumo_defensivo OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 40790)
-- Name: pmo_insumo_defensivo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_insumo_defensivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_insumo_defensivo_id_seq OWNER TO postgres;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 260
-- Name: pmo_insumo_defensivo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_insumo_defensivo_id_seq OWNED BY public.pmo_insumo_defensivo.id;


--
-- TOC entry 227 (class 1259 OID 40500)
-- Name: pmo_integrante_familiar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_integrante_familiar (
    id bigint NOT NULL,
    plano_id bigint NOT NULL,
    nome character varying(200) NOT NULL,
    parentesco character varying(80),
    contato character varying(120)
);


ALTER TABLE public.pmo_integrante_familiar OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 40498)
-- Name: pmo_integrante_familiar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_integrante_familiar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_integrante_familiar_id_seq OWNER TO postgres;

--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 226
-- Name: pmo_integrante_familiar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_integrante_familiar_id_seq OWNED BY public.pmo_integrante_familiar.id;


--
-- TOC entry 275 (class 1259 OID 40906)
-- Name: pmo_integridade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_integridade (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    existe_risco_contaminacao boolean,
    medidas_evitar_contaminacao text
);


ALTER TABLE public.pmo_integridade OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 40904)
-- Name: pmo_integridade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_integridade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_integridade_id_seq OWNER TO postgres;

--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 274
-- Name: pmo_integridade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_integridade_id_seq OWNED BY public.pmo_integridade.id;


--
-- TOC entry 257 (class 1259 OID 40758)
-- Name: pmo_materia_organica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_materia_organica (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    como_faz_compostagem text
);


ALTER TABLE public.pmo_materia_organica OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 40756)
-- Name: pmo_materia_organica_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_materia_organica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_materia_organica_id_seq OWNER TO postgres;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 256
-- Name: pmo_materia_organica_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_materia_organica_id_seq OWNED BY public.pmo_materia_organica.id;


--
-- TOC entry 269 (class 1259 OID 40857)
-- Name: pmo_origem_semente_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_origem_semente_item (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    especie_cultivar character varying(200) NOT NULL,
    origem character varying(20) NOT NULL,
    condicao character varying(20) NOT NULL
);


ALTER TABLE public.pmo_origem_semente_item OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 40855)
-- Name: pmo_origem_semente_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_origem_semente_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_origem_semente_item_id_seq OWNER TO postgres;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 268
-- Name: pmo_origem_semente_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_origem_semente_item_id_seq OWNED BY public.pmo_origem_semente_item.id;


--
-- TOC entry 225 (class 1259 OID 40481)
-- Name: pmo_plano; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_plano (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    tipo_plano character varying(20) NOT NULL,
    escopo character varying(20) NOT NULL,
    grupo character varying(120),
    nucleo character varying(120),
    comunidade character varying(120),
    municipio character varying(120),
    uf character(2),
    unidade_produtiva_familia character varying(200),
    geo_lat character varying(40),
    geo_lng character varying(40),
    responsavel_nome character varying(200),
    responsavel_cpf character varying(20),
    responsavel_contato character varying(120),
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp without time zone DEFAULT now() NOT NULL,
    responsavel_pessoa_id bigint
);


ALTER TABLE public.pmo_plano OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 40870)
-- Name: pmo_plano_cultivo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_plano_cultivo (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    rotacao boolean,
    consorcio boolean,
    descanso boolean,
    plantio_anual boolean,
    outros text
);


ALTER TABLE public.pmo_plano_cultivo OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 40868)
-- Name: pmo_plano_cultivo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_plano_cultivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_plano_cultivo_id_seq OWNER TO postgres;

--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 270
-- Name: pmo_plano_cultivo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_plano_cultivo_id_seq OWNED BY public.pmo_plano_cultivo.id;


--
-- TOC entry 224 (class 1259 OID 40479)
-- Name: pmo_plano_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_plano_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_plano_id_seq OWNER TO postgres;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 224
-- Name: pmo_plano_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_plano_id_seq OWNED BY public.pmo_plano.id;


--
-- TOC entry 263 (class 1259 OID 40808)
-- Name: pmo_plantas_espontaneas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_plantas_espontaneas (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    quais text,
    controle_capina boolean,
    controle_palha boolean,
    controle_rocadeira boolean,
    controle_outros text,
    controle_entorno text
);


ALTER TABLE public.pmo_plantas_espontaneas OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 40806)
-- Name: pmo_plantas_espontaneas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_plantas_espontaneas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_plantas_espontaneas_id_seq OWNER TO postgres;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 262
-- Name: pmo_plantas_espontaneas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_plantas_espontaneas_id_seq OWNED BY public.pmo_plantas_espontaneas.id;


--
-- TOC entry 243 (class 1259 OID 40637)
-- Name: pmo_residuos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_residuos (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    lixo_nao_organico_queima boolean,
    lixo_nao_organico_enterra boolean,
    lixo_nao_organico_reaproveita boolean,
    lixo_nao_organico_coleta_publica boolean,
    lixo_nao_organico_outro text,
    lixo_organico_compostado boolean,
    lixo_organico_queimado boolean,
    lixo_organico_coleta_seletiva boolean,
    lixo_organico_outro text,
    esgoto_fossa_septica boolean,
    esgoto_ceu_aberto boolean,
    esgoto_tratamento boolean,
    esgoto_outro text,
    agua_negra_cinza_destino text
);


ALTER TABLE public.pmo_residuos OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 40635)
-- Name: pmo_residuos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_residuos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_residuos_id_seq OWNER TO postgres;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 242
-- Name: pmo_residuos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_residuos_id_seq OWNED BY public.pmo_residuos.id;


--
-- TOC entry 239 (class 1259 OID 40601)
-- Name: pmo_risco_contaminacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_risco_contaminacao (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    risco_transgenico boolean,
    risco_pulverizacao_proxima boolean,
    risco_insumos_quimicos_proximo boolean,
    risco_cursos_agua boolean,
    risco_pulverizacao_vizinhos boolean,
    controle_barreira_vegetal boolean,
    controle_acordo_vizinho boolean,
    controle_sem_risco boolean,
    controle_outros text,
    dificuldades text
);


ALTER TABLE public.pmo_risco_contaminacao OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 40599)
-- Name: pmo_risco_contaminacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_risco_contaminacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_risco_contaminacao_id_seq OWNER TO postgres;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 238
-- Name: pmo_risco_contaminacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_risco_contaminacao_id_seq OWNED BY public.pmo_risco_contaminacao.id;


--
-- TOC entry 267 (class 1259 OID 40844)
-- Name: pmo_semente_crioula; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_semente_crioula (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    nome_variedade character varying(200) NOT NULL,
    quantidade character varying(120)
);


ALTER TABLE public.pmo_semente_crioula OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 40842)
-- Name: pmo_semente_crioula_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_semente_crioula_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_semente_crioula_id_seq OWNER TO postgres;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 266
-- Name: pmo_semente_crioula_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_semente_crioula_id_seq OWNED BY public.pmo_semente_crioula.id;


--
-- TOC entry 265 (class 1259 OID 40826)
-- Name: pmo_sementes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_sementes (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    usa_sementes_organicas boolean,
    usa_sementes_convencional_nao_tratada boolean,
    usa_proprias boolean,
    usa_convencional_tratada boolean,
    dificuldades text
);


ALTER TABLE public.pmo_sementes OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 40824)
-- Name: pmo_sementes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_sementes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_sementes_id_seq OWNER TO postgres;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 264
-- Name: pmo_sementes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_sementes_id_seq OWNED BY public.pmo_sementes.id;


--
-- TOC entry 235 (class 1259 OID 40569)
-- Name: pmo_solo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_solo (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    descricao_area character varying(200),
    tipo_solo character varying(200) NOT NULL
);


ALTER TABLE public.pmo_solo OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 40567)
-- Name: pmo_solo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_solo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_solo_id_seq OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 234
-- Name: pmo_solo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_solo_id_seq OWNED BY public.pmo_solo.id;


--
-- TOC entry 237 (class 1259 OID 40583)
-- Name: pmo_status_organico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_status_organico (
    id bigint NOT NULL,
    versao_id bigint NOT NULL,
    toda_propriedade_organica boolean,
    possui_producao_paralela boolean,
    ha_conversao boolean,
    conversao_tipo character varying(20),
    prazo_totalmente_organico character varying(20),
    o_que_precisa_fazer text,
    mudancas_para_conversao text
);


ALTER TABLE public.pmo_status_organico OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 40581)
-- Name: pmo_status_organico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_status_organico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_status_organico_id_seq OWNER TO postgres;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 236
-- Name: pmo_status_organico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_status_organico_id_seq OWNED BY public.pmo_status_organico.id;


--
-- TOC entry 229 (class 1259 OID 40514)
-- Name: pmo_versao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pmo_versao (
    id bigint NOT NULL,
    plano_id bigint NOT NULL,
    numero_versao integer NOT NULL,
    status character varying(20) DEFAULT 'RASCUNHO'::character varying NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    aprovado_em timestamp without time zone,
    aprovado_por character varying(200),
    assinatura_fornecedor_uri text,
    assinatura_coordenador_uri text,
    data_aprovacao date
);


ALTER TABLE public.pmo_versao OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 40512)
-- Name: pmo_versao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pmo_versao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pmo_versao_id_seq OWNER TO postgres;

--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 228
-- Name: pmo_versao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pmo_versao_id_seq OWNED BY public.pmo_versao.id;


--
-- TOC entry 205 (class 1259 OID 40135)
-- Name: pratica_agricola; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pratica_agricola (
    id bigint NOT NULL,
    cultivo_id bigint NOT NULL,
    nome_pratica character varying(255) NOT NULL,
    descricao text,
    frequencia character varying(255),
    data_inicio date,
    data_fim date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pratica_agricola OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 40133)
-- Name: pratica_agricola_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pratica_agricola_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pratica_agricola_id_seq OWNER TO postgres;

--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 204
-- Name: pratica_agricola_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pratica_agricola_id_seq OWNED BY public.pratica_agricola.id;


--
-- TOC entry 217 (class 1259 OID 40227)
-- Name: produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    unidade character varying(50),
    preco numeric(10,2),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    categoria character varying(255),
    estoque integer,
    propriedade_id bigint NOT NULL
);


ALTER TABLE public.produto OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 40225)
-- Name: produto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_id_seq OWNER TO postgres;

--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 216
-- Name: produto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_id_seq OWNED BY public.produto.id;


--
-- TOC entry 199 (class 1259 OID 40085)
-- Name: propriedade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propriedade (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    area_total numeric(10,2) NOT NULL,
    localizacao character varying(255),
    responsavel character varying(255),
    tipo_uso character varying(255),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.propriedade OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 40083)
-- Name: propriedade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.propriedade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.propriedade_id_seq OWNER TO postgres;

--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 198
-- Name: propriedade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.propriedade_id_seq OWNED BY public.propriedade.id;


--
-- TOC entry 211 (class 1259 OID 40183)
-- Name: recurso_humano; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurso_humano (
    id bigint NOT NULL,
    propriedade_id bigint NOT NULL,
    nome_trabalhador character varying(255) NOT NULL,
    cargo character varying(255),
    horas_trabalhadas numeric(10,2),
    data_inicio date,
    data_fim date,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recurso_humano OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 40181)
-- Name: recurso_humano_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recurso_humano_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recurso_humano_id_seq OWNER TO postgres;

--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 210
-- Name: recurso_humano_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recurso_humano_id_seq OWNED BY public.recurso_humano.id;


--
-- TOC entry 201 (class 1259 OID 40097)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true,
    propriedade_id bigint NOT NULL,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 40095)
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 200
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- TOC entry 3011 (class 2604 OID 40172)
-- Name: colheita id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colheita ALTER COLUMN id SET DEFAULT nextval('public.colheita_id_seq'::regclass);


--
-- TOC entry 3021 (class 2604 OID 40239)
-- Name: contas_pagar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar ALTER COLUMN id SET DEFAULT nextval('public.contas_pagar_id_seq'::regclass);


--
-- TOC entry 3024 (class 2604 OID 40274)
-- Name: contas_receber id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber ALTER COLUMN id SET DEFAULT nextval('public.contas_receber_id_seq'::regclass);


--
-- TOC entry 3005 (class 2604 OID 40121)
-- Name: cultivo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultivo ALTER COLUMN id SET DEFAULT nextval('public.cultivo_id_seq'::regclass);


--
-- TOC entry 3015 (class 2604 OID 40203)
-- Name: indicador_sustentabilidade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicador_sustentabilidade ALTER COLUMN id SET DEFAULT nextval('public.indicador_sustentabilidade_id_seq'::regclass);


--
-- TOC entry 3009 (class 2604 OID 40155)
-- Name: insumo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo ALTER COLUMN id SET DEFAULT nextval('public.insumo_id_seq'::regclass);


--
-- TOC entry 3017 (class 2604 OID 40217)
-- Name: pessoa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa ALTER COLUMN id SET DEFAULT nextval('public.pessoa_id_seq'::regclass);


--
-- TOC entry 3027 (class 2604 OID 40333)
-- Name: pessoa_propriedade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa_propriedade ALTER COLUMN id SET DEFAULT nextval('public.pessoa_propriedade_id_seq'::regclass);


--
-- TOC entry 3036 (class 2604 OID 40554)
-- Name: pmo_acesso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_acesso ALTER COLUMN id SET DEFAULT nextval('public.pmo_acesso_id_seq'::regclass);


--
-- TOC entry 3040 (class 2604 OID 40622)
-- Name: pmo_agua id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_agua ALTER COLUMN id SET DEFAULT nextval('public.pmo_agua_id_seq'::regclass);


--
-- TOC entry 3059 (class 2604 OID 40945)
-- Name: pmo_anexo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_anexo ALTER COLUMN id SET DEFAULT nextval('public.pmo_anexo_id_seq'::regclass);


--
-- TOC entry 3046 (class 2604 OID 40726)
-- Name: pmo_animais id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_animais ALTER COLUMN id SET DEFAULT nextval('public.pmo_animais_id_seq'::regclass);


--
-- TOC entry 3035 (class 2604 OID 40539)
-- Name: pmo_area_resumo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_area_resumo ALTER COLUMN id SET DEFAULT nextval('public.pmo_area_resumo_id_seq'::regclass);


--
-- TOC entry 3056 (class 2604 OID 40891)
-- Name: pmo_armazenamento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_armazenamento ALTER COLUMN id SET DEFAULT nextval('public.pmo_armazenamento_id_seq'::regclass);


--
-- TOC entry 3042 (class 2604 OID 40658)
-- Name: pmo_biodiversidade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_biodiversidade ALTER COLUMN id SET DEFAULT nextval('public.pmo_biodiversidade_id_seq'::regclass);


--
-- TOC entry 3058 (class 2604 OID 40927)
-- Name: pmo_comercializacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_comercializacao ALTER COLUMN id SET DEFAULT nextval('public.pmo_comercializacao_id_seq'::regclass);


--
-- TOC entry 3043 (class 2604 OID 40676)
-- Name: pmo_controles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_controles ALTER COLUMN id SET DEFAULT nextval('public.pmo_controles_id_seq'::regclass);


--
-- TOC entry 3047 (class 2604 OID 40744)
-- Name: pmo_cultivo_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_cultivo_item ALTER COLUMN id SET DEFAULT nextval('public.pmo_cultivo_item_id_seq'::regclass);


--
-- TOC entry 3045 (class 2604 OID 40710)
-- Name: pmo_equipamento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_equipamento ALTER COLUMN id SET DEFAULT nextval('public.pmo_equipamento_id_seq'::regclass);


--
-- TOC entry 3044 (class 2604 OID 40694)
-- Name: pmo_estrutura id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_estrutura ALTER COLUMN id SET DEFAULT nextval('public.pmo_estrutura_id_seq'::regclass);


--
-- TOC entry 3049 (class 2604 OID 40779)
-- Name: pmo_insumo_adubacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_adubacao ALTER COLUMN id SET DEFAULT nextval('public.pmo_insumo_adubacao_id_seq'::regclass);


--
-- TOC entry 3050 (class 2604 OID 40795)
-- Name: pmo_insumo_defensivo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_defensivo ALTER COLUMN id SET DEFAULT nextval('public.pmo_insumo_defensivo_id_seq'::regclass);


--
-- TOC entry 3031 (class 2604 OID 40503)
-- Name: pmo_integrante_familiar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integrante_familiar ALTER COLUMN id SET DEFAULT nextval('public.pmo_integrante_familiar_id_seq'::regclass);


--
-- TOC entry 3057 (class 2604 OID 40909)
-- Name: pmo_integridade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integridade ALTER COLUMN id SET DEFAULT nextval('public.pmo_integridade_id_seq'::regclass);


--
-- TOC entry 3048 (class 2604 OID 40761)
-- Name: pmo_materia_organica id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_materia_organica ALTER COLUMN id SET DEFAULT nextval('public.pmo_materia_organica_id_seq'::regclass);


--
-- TOC entry 3054 (class 2604 OID 40860)
-- Name: pmo_origem_semente_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_origem_semente_item ALTER COLUMN id SET DEFAULT nextval('public.pmo_origem_semente_item_id_seq'::regclass);


--
-- TOC entry 3028 (class 2604 OID 40484)
-- Name: pmo_plano id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano ALTER COLUMN id SET DEFAULT nextval('public.pmo_plano_id_seq'::regclass);


--
-- TOC entry 3055 (class 2604 OID 40873)
-- Name: pmo_plano_cultivo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano_cultivo ALTER COLUMN id SET DEFAULT nextval('public.pmo_plano_cultivo_id_seq'::regclass);


--
-- TOC entry 3051 (class 2604 OID 40811)
-- Name: pmo_plantas_espontaneas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plantas_espontaneas ALTER COLUMN id SET DEFAULT nextval('public.pmo_plantas_espontaneas_id_seq'::regclass);


--
-- TOC entry 3041 (class 2604 OID 40640)
-- Name: pmo_residuos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_residuos ALTER COLUMN id SET DEFAULT nextval('public.pmo_residuos_id_seq'::regclass);


--
-- TOC entry 3039 (class 2604 OID 40604)
-- Name: pmo_risco_contaminacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_risco_contaminacao ALTER COLUMN id SET DEFAULT nextval('public.pmo_risco_contaminacao_id_seq'::regclass);


--
-- TOC entry 3053 (class 2604 OID 40847)
-- Name: pmo_semente_crioula id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_semente_crioula ALTER COLUMN id SET DEFAULT nextval('public.pmo_semente_crioula_id_seq'::regclass);


--
-- TOC entry 3052 (class 2604 OID 40829)
-- Name: pmo_sementes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_sementes ALTER COLUMN id SET DEFAULT nextval('public.pmo_sementes_id_seq'::regclass);


--
-- TOC entry 3037 (class 2604 OID 40572)
-- Name: pmo_solo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_solo ALTER COLUMN id SET DEFAULT nextval('public.pmo_solo_id_seq'::regclass);


--
-- TOC entry 3038 (class 2604 OID 40586)
-- Name: pmo_status_organico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_status_organico ALTER COLUMN id SET DEFAULT nextval('public.pmo_status_organico_id_seq'::regclass);


--
-- TOC entry 3032 (class 2604 OID 40517)
-- Name: pmo_versao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_versao ALTER COLUMN id SET DEFAULT nextval('public.pmo_versao_id_seq'::regclass);


--
-- TOC entry 3007 (class 2604 OID 40138)
-- Name: pratica_agricola id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pratica_agricola ALTER COLUMN id SET DEFAULT nextval('public.pratica_agricola_id_seq'::regclass);


--
-- TOC entry 3019 (class 2604 OID 40230)
-- Name: produto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto ALTER COLUMN id SET DEFAULT nextval('public.produto_id_seq'::regclass);


--
-- TOC entry 2999 (class 2604 OID 40088)
-- Name: propriedade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propriedade ALTER COLUMN id SET DEFAULT nextval('public.propriedade_id_seq'::regclass);


--
-- TOC entry 3013 (class 2604 OID 40186)
-- Name: recurso_humano id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurso_humano ALTER COLUMN id SET DEFAULT nextval('public.recurso_humano_id_seq'::regclass);


--
-- TOC entry 3001 (class 2604 OID 40100)
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 3374 (class 0 OID 40169)
-- Dependencies: 209
-- Data for Name: colheita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colheita (id, cultivo_id, data_colheita, quantidade_colhida, qualidade_produto, criado_em) FROM stdin;
\.


--
-- TOC entry 3384 (class 0 OID 40236)
-- Dependencies: 219
-- Data for Name: contas_pagar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contas_pagar (id, propriedade_id, cliente_id, fornecedor_id, descricao, valor, data_vencimento, data_pagamento, pago, criado_em) FROM stdin;
\.


--
-- TOC entry 3386 (class 0 OID 40271)
-- Dependencies: 221
-- Data for Name: contas_receber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contas_receber (id, propriedade_id, cliente_id, pessoa_id, produto_id, descricao, valor, data_prevista, data_recebimento, recebido, criado_em) FROM stdin;
\.


--
-- TOC entry 3368 (class 0 OID 40118)
-- Dependencies: 203
-- Data for Name: cultivo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cultivo (id, propriedade_id, nome_cultivo, tipo_cultivo, area_cultivo, data_plantio, previsao_colheita, criado_em) FROM stdin;
\.


--
-- TOC entry 3362 (class 0 OID 40073)
-- Dependencies: 197
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init core	SQL	V1__init_core.sql	1459107001	postgres	2025-12-14 18:51:09.558293	166	t
2	2	pessoa propriedade	SQL	V2__pessoa_propriedade.sql	-553394073	postgres	2025-12-14 18:51:09.787096	15	t
3	3	add categoria to produto	SQL	V3__add_categoria_to_produto.sql	-535632275	postgres	2025-12-14 18:51:09.820011	22	t
4	4	add categoria estoque produto	SQL	V4__add_categoria_estoque_produto.sql	247353416	postgres	2025-12-14 18:52:47.827916	16	t
5	5	pmo core	SQL	V5__pmo_core.sql	1425500637	postgres	2025-12-27 12:49:02.643624	459	t
6	6	pmo responsavel ref	SQL	V6__pmo_responsavel_ref.sql	768137173	postgres	2025-12-27 12:49:03.190239	12	t
7	7	add pessoa propriedade vinculo	SQL	V7__add_pessoa_propriedade_vinculo.sql	-69584038	postgres	2025-12-27 12:49:03.214848	5	t
\.


--
-- TOC entry 3378 (class 0 OID 40200)
-- Dependencies: 213
-- Data for Name: indicador_sustentabilidade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.indicador_sustentabilidade (id, propriedade_id, tipo_indicador, valor_indicador, unidade_medida, data_checagem, criado_em) FROM stdin;
\.


--
-- TOC entry 3372 (class 0 OID 40152)
-- Dependencies: 207
-- Data for Name: insumo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumo (id, cultivo_id, nome_insumo, tipo_insumo, quantidade, custo_unitario, data_utilizacao, criado_em) FROM stdin;
\.


--
-- TOC entry 3380 (class 0 OID 40214)
-- Dependencies: 215
-- Data for Name: pessoa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pessoa (id, nome_razao, tipo_pessoa, cpf_cnpj, telefone, email, criado_em) FROM stdin;
1	Jão	F	12345678909	85-988888888	\N	2025-12-27 15:39:39.92345
\.


--
-- TOC entry 3387 (class 0 OID 40309)
-- Dependencies: 222
-- Data for Name: pessoa_propriedade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pessoa_propriedade (pessoa_id, propriedade_id, id, tipo_relacao, tipo_vinculo) FROM stdin;
\.


--
-- TOC entry 3398 (class 0 OID 40551)
-- Dependencies: 233
-- Data for Name: pmo_acesso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_acesso (id, versao_id, roteiro_acesso) FROM stdin;
\.


--
-- TOC entry 3406 (class 0 OID 40619)
-- Dependencies: 241
-- Data for Name: pmo_agua; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_agua (id, versao_id, fonte_acude, fonte_corrego_rio, fonte_corrego_nome, fonte_poco, fonte_riacho, fonte_cisterna, fonte_outros, irrigacao_aspersao, irrigacao_microaspersao, irrigacao_gotejamento, irrigacao_bombeamento, irrigacao_gravidade, irrigacao_sulcos, irrigacao_nenhum, analise_agua_feita, condicoes_analise, risco_contaminacao_agua, risco_contaminacao_agua_desc, acoes_qualidade_agua) FROM stdin;
\.


--
-- TOC entry 3444 (class 0 OID 40942)
-- Dependencies: 279
-- Data for Name: pmo_anexo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_anexo (id, versao_id, tipo, nome_arquivo, mime_type, uri, descricao, criado_em) FROM stdin;
\.


--
-- TOC entry 3418 (class 0 OID 40723)
-- Dependencies: 253
-- Data for Name: pmo_animais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_animais (id, versao_id, possui_animais, quais, alimentacao, tratamento_doencas, mantem_presos, circulam_livre, liberdade_outro, oferecem_risco_contaminacao, mitigacao_risco) FROM stdin;
\.


--
-- TOC entry 3396 (class 0 OID 40536)
-- Dependencies: 231
-- Data for Name: pmo_area_resumo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_area_resumo (id, versao_id, total_assentamento_m2, area_manejo_organico_m2, reserva_legal_m2, area_producao_paralela_m2, area_estruturas_moradias_m2) FROM stdin;
\.


--
-- TOC entry 3438 (class 0 OID 40888)
-- Dependencies: 273
-- Data for Name: pmo_armazenamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_armazenamento (id, versao_id, locais_organicos, locais_nao_organicos) FROM stdin;
\.


--
-- TOC entry 3410 (class 0 OID 40655)
-- Dependencies: 245
-- Data for Name: pmo_biodiversidade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_biodiversidade (id, versao_id, consorcio, recuperacao_apps, rotacao_cultura, quebra_vento, sem_fogo, faixas_anti_erosao, curva_nivel, reserva_legal, plantio_direto, adubacao_organica, adubacao_verde, cobertura_solo, safs, outros) FROM stdin;
\.


--
-- TOC entry 3442 (class 0 OID 40924)
-- Dependencies: 277
-- Data for Name: pmo_comercializacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_comercializacao (id, versao_id, venda_direta_feiras, venda_direta_feiras_quais, venda_entrega_domicilio, venda_cestas, venda_outra, venda_governo_paa, venda_governo_pnae, revenda_pequeno_varejo, revenda_supermercado_bairro, revenda_rede_supermercado, revenda_intermediario, rastreabilidade_desc, mao_de_obra_regular, mao_de_obra_qtd_pessoas, mao_de_obra_horas_semana, relacao_trabalhista, assistencia_tecnica, assistencia_tecnica_quem, assistencia_tecnica_frequencia) FROM stdin;
\.


--
-- TOC entry 3412 (class 0 OID 40673)
-- Dependencies: 247
-- Data for Name: pmo_controles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_controles (id, versao_id, como_registra_producao_venda, controle_por_lote, controle_por_data_colheita, controle_declaracao_transacao, controle_nota_recibo, controle_outros, controle_origem_entrada, origem_nota_fiscal, origem_recibo, origem_registro_interno, origem_outros) FROM stdin;
\.


--
-- TOC entry 3420 (class 0 OID 40741)
-- Dependencies: 255
-- Data for Name: pmo_cultivo_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_cultivo_item (id, versao_id, tipo, categoria, produto_especie_variedade, area_valor, area_unidade, estimativa_anual, observacao) FROM stdin;
\.


--
-- TOC entry 3416 (class 0 OID 40707)
-- Dependencies: 251
-- Data for Name: pmo_equipamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_equipamento (id, versao_id, especificacao, tempo_meses, estado, observacao) FROM stdin;
\.


--
-- TOC entry 3414 (class 0 OID 40691)
-- Dependencies: 249
-- Data for Name: pmo_estrutura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_estrutura (id, versao_id, nome, tempo_meses, estado, observacao) FROM stdin;
\.


--
-- TOC entry 3424 (class 0 OID 40776)
-- Dependencies: 259
-- Data for Name: pmo_insumo_adubacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_insumo_adubacao (id, versao_id, substancia, marca_nome_comercial, cultura_area, quantidade_dose) FROM stdin;
\.


--
-- TOC entry 3426 (class 0 OID 40792)
-- Dependencies: 261
-- Data for Name: pmo_insumo_defensivo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_insumo_defensivo (id, versao_id, substancia, marca_nome_comercial, cultura_area, quantidade_dose) FROM stdin;
\.


--
-- TOC entry 3392 (class 0 OID 40500)
-- Dependencies: 227
-- Data for Name: pmo_integrante_familiar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_integrante_familiar (id, plano_id, nome, parentesco, contato) FROM stdin;
\.


--
-- TOC entry 3440 (class 0 OID 40906)
-- Dependencies: 275
-- Data for Name: pmo_integridade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_integridade (id, versao_id, existe_risco_contaminacao, medidas_evitar_contaminacao) FROM stdin;
\.


--
-- TOC entry 3422 (class 0 OID 40758)
-- Dependencies: 257
-- Data for Name: pmo_materia_organica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_materia_organica (id, versao_id, como_faz_compostagem) FROM stdin;
\.


--
-- TOC entry 3434 (class 0 OID 40857)
-- Dependencies: 269
-- Data for Name: pmo_origem_semente_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_origem_semente_item (id, versao_id, especie_cultivar, origem, condicao) FROM stdin;
\.


--
-- TOC entry 3390 (class 0 OID 40481)
-- Dependencies: 225
-- Data for Name: pmo_plano; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_plano (id, propriedade_id, tipo_plano, escopo, grupo, nucleo, comunidade, municipio, uf, unidade_produtiva_familia, geo_lat, geo_lng, responsavel_nome, responsavel_cpf, responsavel_contato, criado_em, atualizado_em, responsavel_pessoa_id) FROM stdin;
1	5	PMA	PROPRIEDADE	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2025-12-27 15:24:53.664195	2025-12-27 15:24:53.664195	1
2	2	PMAteste	PROPRIEDADE	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 16:50:23.622626	2026-01-03 16:50:23.622626	1
3	4	PMAtgeste3	PROPRIEDADE	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 17:31:02.841377	2026-01-03 17:31:02.841377	1
4	2	PMAeeee	PROPRIEDADEeeee	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:13:46.462778	2026-01-03 18:13:46.462778	1
5	2	PMAtetet12233	PROPRIEDADE10	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:14:41.349329	2026-01-03 18:14:41.349329	1
6	2	PMA11	PROPRIEDADE11	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:16:13.541572	2026-01-03 18:16:13.541572	1
7	2	PMA15	PROPRIEDADE15	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:20:49.569088	2026-01-03 18:20:49.569088	1
8	2	PMA16	PROPRIEDADE16	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:23:21.823814	2026-01-03 18:23:21.823814	1
9	2	PMA17	PROPRIEDADE17	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:25:03.68545	2026-01-03 18:25:03.68545	1
10	2	PMA18	PROPRIEDADE18	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:25:34.10022	2026-01-03 18:25:34.10022	1
11	2	PMA19	PROPRIEDADE10	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 18:27:13.226222	2026-01-03 18:27:13.226222	1
12	2	PMO12	PROPRIEDADE12	\N	\N	\N	\N	\N	\N	\N	\N	Jão	12345678909	85-988888888	2026-01-03 19:16:01.342724	2026-01-03 19:16:01.342724	1
\.


--
-- TOC entry 3436 (class 0 OID 40870)
-- Dependencies: 271
-- Data for Name: pmo_plano_cultivo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_plano_cultivo (id, versao_id, rotacao, consorcio, descanso, plantio_anual, outros) FROM stdin;
\.


--
-- TOC entry 3428 (class 0 OID 40808)
-- Dependencies: 263
-- Data for Name: pmo_plantas_espontaneas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_plantas_espontaneas (id, versao_id, quais, controle_capina, controle_palha, controle_rocadeira, controle_outros, controle_entorno) FROM stdin;
\.


--
-- TOC entry 3408 (class 0 OID 40637)
-- Dependencies: 243
-- Data for Name: pmo_residuos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_residuos (id, versao_id, lixo_nao_organico_queima, lixo_nao_organico_enterra, lixo_nao_organico_reaproveita, lixo_nao_organico_coleta_publica, lixo_nao_organico_outro, lixo_organico_compostado, lixo_organico_queimado, lixo_organico_coleta_seletiva, lixo_organico_outro, esgoto_fossa_septica, esgoto_ceu_aberto, esgoto_tratamento, esgoto_outro, agua_negra_cinza_destino) FROM stdin;
\.


--
-- TOC entry 3404 (class 0 OID 40601)
-- Dependencies: 239
-- Data for Name: pmo_risco_contaminacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_risco_contaminacao (id, versao_id, risco_transgenico, risco_pulverizacao_proxima, risco_insumos_quimicos_proximo, risco_cursos_agua, risco_pulverizacao_vizinhos, controle_barreira_vegetal, controle_acordo_vizinho, controle_sem_risco, controle_outros, dificuldades) FROM stdin;
\.


--
-- TOC entry 3432 (class 0 OID 40844)
-- Dependencies: 267
-- Data for Name: pmo_semente_crioula; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_semente_crioula (id, versao_id, nome_variedade, quantidade) FROM stdin;
\.


--
-- TOC entry 3430 (class 0 OID 40826)
-- Dependencies: 265
-- Data for Name: pmo_sementes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_sementes (id, versao_id, usa_sementes_organicas, usa_sementes_convencional_nao_tratada, usa_proprias, usa_convencional_tratada, dificuldades) FROM stdin;
\.


--
-- TOC entry 3400 (class 0 OID 40569)
-- Dependencies: 235
-- Data for Name: pmo_solo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_solo (id, versao_id, descricao_area, tipo_solo) FROM stdin;
\.


--
-- TOC entry 3402 (class 0 OID 40583)
-- Dependencies: 237
-- Data for Name: pmo_status_organico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_status_organico (id, versao_id, toda_propriedade_organica, possui_producao_paralela, ha_conversao, conversao_tipo, prazo_totalmente_organico, o_que_precisa_fazer, mudancas_para_conversao) FROM stdin;
\.


--
-- TOC entry 3394 (class 0 OID 40514)
-- Dependencies: 229
-- Data for Name: pmo_versao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pmo_versao (id, plano_id, numero_versao, status, criado_em, aprovado_em, aprovado_por, assinatura_fornecedor_uri, assinatura_coordenador_uri, data_aprovacao) FROM stdin;
\.


--
-- TOC entry 3370 (class 0 OID 40135)
-- Dependencies: 205
-- Data for Name: pratica_agricola; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pratica_agricola (id, cultivo_id, nome_pratica, descricao, frequencia, data_inicio, data_fim, criado_em) FROM stdin;
\.


--
-- TOC entry 3382 (class 0 OID 40227)
-- Dependencies: 217
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto (id, nome, unidade, preco, criado_em, categoria, estoque, propriedade_id) FROM stdin;
\.


--
-- TOC entry 3364 (class 0 OID 40085)
-- Dependencies: 199
-- Data for Name: propriedade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.propriedade (id, nome, area_total, localizacao, responsavel, tipo_uso, criado_em) FROM stdin;
2	Propriedade Principal	0.00	\N	\N	1	2025-12-15 21:15:06.400571
4	Fazenda Boa Vista	120.50	Uberlândia - MG	João Silva	AGRICULTURA	2025-12-16 21:00:45.408761
5	Fazenda Boa Vista	120.50	Uberlândia - MG	João Silva	AGRICULTURA	2025-12-27 15:24:35.223049
\.


--
-- TOC entry 3376 (class 0 OID 40183)
-- Dependencies: 211
-- Data for Name: recurso_humano; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurso_humano (id, propriedade_id, nome_trabalhador, cargo, horas_trabalhadas, data_inicio, data_fim, criado_em) FROM stdin;
\.


--
-- TOC entry 3366 (class 0 OID 40097)
-- Dependencies: 201
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, nome, email, senha, ativo, propriedade_id, data_criacao, criado_em) FROM stdin;
2	Administrador	admin@agrosaas.com	$2a$06$SztxDCPxuOhSbiR4ti7QDO1L/a8LUtLKIZqjA/MU13cnqqkHdRqOO	t	2	2025-12-15 21:15:25.588126	2025-12-15 21:15:25.588126
\.


--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 208
-- Name: colheita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colheita_id_seq', 1, false);


--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 218
-- Name: contas_pagar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contas_pagar_id_seq', 1, false);


--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 220
-- Name: contas_receber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contas_receber_id_seq', 1, false);


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 202
-- Name: cultivo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultivo_id_seq', 1, false);


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 212
-- Name: indicador_sustentabilidade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.indicador_sustentabilidade_id_seq', 1, false);


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 206
-- Name: insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumo_id_seq', 1, false);


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 214
-- Name: pessoa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pessoa_id_seq', 1, true);


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 223
-- Name: pessoa_propriedade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pessoa_propriedade_id_seq', 1, false);


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 232
-- Name: pmo_acesso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_acesso_id_seq', 1, false);


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 240
-- Name: pmo_agua_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_agua_id_seq', 1, false);


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 278
-- Name: pmo_anexo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_anexo_id_seq', 1, false);


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 252
-- Name: pmo_animais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_animais_id_seq', 1, false);


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 230
-- Name: pmo_area_resumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_area_resumo_id_seq', 1, false);


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 272
-- Name: pmo_armazenamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_armazenamento_id_seq', 1, false);


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 244
-- Name: pmo_biodiversidade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_biodiversidade_id_seq', 1, false);


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 276
-- Name: pmo_comercializacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_comercializacao_id_seq', 1, false);


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 246
-- Name: pmo_controles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_controles_id_seq', 1, false);


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 254
-- Name: pmo_cultivo_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_cultivo_item_id_seq', 1, false);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 250
-- Name: pmo_equipamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_equipamento_id_seq', 1, false);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 248
-- Name: pmo_estrutura_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_estrutura_id_seq', 1, false);


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 258
-- Name: pmo_insumo_adubacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_insumo_adubacao_id_seq', 1, false);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 260
-- Name: pmo_insumo_defensivo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_insumo_defensivo_id_seq', 1, false);


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 226
-- Name: pmo_integrante_familiar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_integrante_familiar_id_seq', 1, false);


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 274
-- Name: pmo_integridade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_integridade_id_seq', 1, false);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 256
-- Name: pmo_materia_organica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_materia_organica_id_seq', 1, false);


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 268
-- Name: pmo_origem_semente_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_origem_semente_item_id_seq', 1, false);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 270
-- Name: pmo_plano_cultivo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_plano_cultivo_id_seq', 1, false);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 224
-- Name: pmo_plano_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_plano_id_seq', 12, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 262
-- Name: pmo_plantas_espontaneas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_plantas_espontaneas_id_seq', 1, false);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 242
-- Name: pmo_residuos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_residuos_id_seq', 1, false);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 238
-- Name: pmo_risco_contaminacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_risco_contaminacao_id_seq', 1, false);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 266
-- Name: pmo_semente_crioula_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_semente_crioula_id_seq', 1, false);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 264
-- Name: pmo_sementes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_sementes_id_seq', 1, false);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 234
-- Name: pmo_solo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_solo_id_seq', 1, false);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 236
-- Name: pmo_status_organico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_status_organico_id_seq', 1, false);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 228
-- Name: pmo_versao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pmo_versao_id_seq', 1, false);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 204
-- Name: pratica_agricola_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pratica_agricola_id_seq', 1, false);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 216
-- Name: produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_id_seq', 1, false);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 198
-- Name: propriedade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.propriedade_id_seq', 5, true);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 210
-- Name: recurso_humano_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recurso_humano_id_seq', 1, false);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 200
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 2, true);


--
-- TOC entry 3077 (class 2606 OID 40175)
-- Name: colheita colheita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colheita
    ADD CONSTRAINT colheita_pkey PRIMARY KEY (id);


--
-- TOC entry 3088 (class 2606 OID 40243)
-- Name: contas_pagar contas_pagar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_pkey PRIMARY KEY (id);


--
-- TOC entry 3090 (class 2606 OID 40278)
-- Name: contas_receber contas_receber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_pkey PRIMARY KEY (id);


--
-- TOC entry 3071 (class 2606 OID 40127)
-- Name: cultivo cultivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultivo
    ADD CONSTRAINT cultivo_pkey PRIMARY KEY (id);


--
-- TOC entry 3062 (class 2606 OID 40081)
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- TOC entry 3081 (class 2606 OID 40206)
-- Name: indicador_sustentabilidade indicador_sustentabilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicador_sustentabilidade
    ADD CONSTRAINT indicador_sustentabilidade_pkey PRIMARY KEY (id);


--
-- TOC entry 3075 (class 2606 OID 40161)
-- Name: insumo insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (id);


--
-- TOC entry 3084 (class 2606 OID 40223)
-- Name: pessoa pessoa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (id);


--
-- TOC entry 3092 (class 2606 OID 40335)
-- Name: pessoa_propriedade pessoa_propriedade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa_propriedade
    ADD CONSTRAINT pessoa_propriedade_pkey PRIMARY KEY (id);


--
-- TOC entry 3111 (class 2606 OID 40559)
-- Name: pmo_acesso pmo_acesso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_acesso
    ADD CONSTRAINT pmo_acesso_pkey PRIMARY KEY (id);


--
-- TOC entry 3126 (class 2606 OID 40627)
-- Name: pmo_agua pmo_agua_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_agua
    ADD CONSTRAINT pmo_agua_pkey PRIMARY KEY (id);


--
-- TOC entry 3190 (class 2606 OID 40951)
-- Name: pmo_anexo pmo_anexo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_anexo
    ADD CONSTRAINT pmo_anexo_pkey PRIMARY KEY (id);


--
-- TOC entry 3146 (class 2606 OID 40731)
-- Name: pmo_animais pmo_animais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_animais
    ADD CONSTRAINT pmo_animais_pkey PRIMARY KEY (id);


--
-- TOC entry 3107 (class 2606 OID 40541)
-- Name: pmo_area_resumo pmo_area_resumo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_area_resumo
    ADD CONSTRAINT pmo_area_resumo_pkey PRIMARY KEY (id);


--
-- TOC entry 3177 (class 2606 OID 40896)
-- Name: pmo_armazenamento pmo_armazenamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_armazenamento
    ADD CONSTRAINT pmo_armazenamento_pkey PRIMARY KEY (id);


--
-- TOC entry 3134 (class 2606 OID 40663)
-- Name: pmo_biodiversidade pmo_biodiversidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_biodiversidade
    ADD CONSTRAINT pmo_biodiversidade_pkey PRIMARY KEY (id);


--
-- TOC entry 3185 (class 2606 OID 40932)
-- Name: pmo_comercializacao pmo_comercializacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_comercializacao
    ADD CONSTRAINT pmo_comercializacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3138 (class 2606 OID 40681)
-- Name: pmo_controles pmo_controles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_controles
    ADD CONSTRAINT pmo_controles_pkey PRIMARY KEY (id);


--
-- TOC entry 3151 (class 2606 OID 40749)
-- Name: pmo_cultivo_item pmo_cultivo_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_cultivo_item
    ADD CONSTRAINT pmo_cultivo_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3144 (class 2606 OID 40715)
-- Name: pmo_equipamento pmo_equipamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_equipamento
    ADD CONSTRAINT pmo_equipamento_pkey PRIMARY KEY (id);


--
-- TOC entry 3142 (class 2606 OID 40699)
-- Name: pmo_estrutura pmo_estrutura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_estrutura
    ADD CONSTRAINT pmo_estrutura_pkey PRIMARY KEY (id);


--
-- TOC entry 3157 (class 2606 OID 40784)
-- Name: pmo_insumo_adubacao pmo_insumo_adubacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_adubacao
    ADD CONSTRAINT pmo_insumo_adubacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3159 (class 2606 OID 40800)
-- Name: pmo_insumo_defensivo pmo_insumo_defensivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_defensivo
    ADD CONSTRAINT pmo_insumo_defensivo_pkey PRIMARY KEY (id);


--
-- TOC entry 3099 (class 2606 OID 40505)
-- Name: pmo_integrante_familiar pmo_integrante_familiar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integrante_familiar
    ADD CONSTRAINT pmo_integrante_familiar_pkey PRIMARY KEY (id);


--
-- TOC entry 3181 (class 2606 OID 40914)
-- Name: pmo_integridade pmo_integridade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integridade
    ADD CONSTRAINT pmo_integridade_pkey PRIMARY KEY (id);


--
-- TOC entry 3153 (class 2606 OID 40766)
-- Name: pmo_materia_organica pmo_materia_organica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_materia_organica
    ADD CONSTRAINT pmo_materia_organica_pkey PRIMARY KEY (id);


--
-- TOC entry 3171 (class 2606 OID 40862)
-- Name: pmo_origem_semente_item pmo_origem_semente_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_origem_semente_item
    ADD CONSTRAINT pmo_origem_semente_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3173 (class 2606 OID 40878)
-- Name: pmo_plano_cultivo pmo_plano_cultivo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano_cultivo
    ADD CONSTRAINT pmo_plano_cultivo_pkey PRIMARY KEY (id);


--
-- TOC entry 3096 (class 2606 OID 40491)
-- Name: pmo_plano pmo_plano_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano
    ADD CONSTRAINT pmo_plano_pkey PRIMARY KEY (id);


--
-- TOC entry 3161 (class 2606 OID 40816)
-- Name: pmo_plantas_espontaneas pmo_plantas_espontaneas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plantas_espontaneas
    ADD CONSTRAINT pmo_plantas_espontaneas_pkey PRIMARY KEY (id);


--
-- TOC entry 3130 (class 2606 OID 40645)
-- Name: pmo_residuos pmo_residuos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_residuos
    ADD CONSTRAINT pmo_residuos_pkey PRIMARY KEY (id);


--
-- TOC entry 3122 (class 2606 OID 40609)
-- Name: pmo_risco_contaminacao pmo_risco_contaminacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_risco_contaminacao
    ADD CONSTRAINT pmo_risco_contaminacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3169 (class 2606 OID 40849)
-- Name: pmo_semente_crioula pmo_semente_crioula_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_semente_crioula
    ADD CONSTRAINT pmo_semente_crioula_pkey PRIMARY KEY (id);


--
-- TOC entry 3165 (class 2606 OID 40834)
-- Name: pmo_sementes pmo_sementes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_sementes
    ADD CONSTRAINT pmo_sementes_pkey PRIMARY KEY (id);


--
-- TOC entry 3116 (class 2606 OID 40574)
-- Name: pmo_solo pmo_solo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_solo
    ADD CONSTRAINT pmo_solo_pkey PRIMARY KEY (id);


--
-- TOC entry 3118 (class 2606 OID 40591)
-- Name: pmo_status_organico pmo_status_organico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_status_organico
    ADD CONSTRAINT pmo_status_organico_pkey PRIMARY KEY (id);


--
-- TOC entry 3103 (class 2606 OID 40524)
-- Name: pmo_versao pmo_versao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_versao
    ADD CONSTRAINT pmo_versao_pkey PRIMARY KEY (id);


--
-- TOC entry 3073 (class 2606 OID 40144)
-- Name: pratica_agricola pratica_agricola_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pratica_agricola
    ADD CONSTRAINT pratica_agricola_pkey PRIMARY KEY (id);


--
-- TOC entry 3086 (class 2606 OID 40233)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id);


--
-- TOC entry 3065 (class 2606 OID 40094)
-- Name: propriedade propriedade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propriedade
    ADD CONSTRAINT propriedade_pkey PRIMARY KEY (id);


--
-- TOC entry 3079 (class 2606 OID 40192)
-- Name: recurso_humano recurso_humano_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurso_humano
    ADD CONSTRAINT recurso_humano_pkey PRIMARY KEY (id);


--
-- TOC entry 3113 (class 2606 OID 40561)
-- Name: pmo_acesso uq_pmo_acesso_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_acesso
    ADD CONSTRAINT uq_pmo_acesso_unique UNIQUE (versao_id);


--
-- TOC entry 3128 (class 2606 OID 40629)
-- Name: pmo_agua uq_pmo_agua_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_agua
    ADD CONSTRAINT uq_pmo_agua_unique UNIQUE (versao_id);


--
-- TOC entry 3148 (class 2606 OID 40733)
-- Name: pmo_animais uq_pmo_animais_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_animais
    ADD CONSTRAINT uq_pmo_animais_unique UNIQUE (versao_id);


--
-- TOC entry 3109 (class 2606 OID 40543)
-- Name: pmo_area_resumo uq_pmo_area_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_area_resumo
    ADD CONSTRAINT uq_pmo_area_unique UNIQUE (versao_id);


--
-- TOC entry 3179 (class 2606 OID 40898)
-- Name: pmo_armazenamento uq_pmo_arm_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_armazenamento
    ADD CONSTRAINT uq_pmo_arm_unique UNIQUE (versao_id);


--
-- TOC entry 3136 (class 2606 OID 40665)
-- Name: pmo_biodiversidade uq_pmo_biodiv_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_biodiversidade
    ADD CONSTRAINT uq_pmo_biodiv_unique UNIQUE (versao_id);


--
-- TOC entry 3187 (class 2606 OID 40934)
-- Name: pmo_comercializacao uq_pmo_comerc_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_comercializacao
    ADD CONSTRAINT uq_pmo_comerc_unique UNIQUE (versao_id);


--
-- TOC entry 3140 (class 2606 OID 40683)
-- Name: pmo_controles uq_pmo_controles_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_controles
    ADD CONSTRAINT uq_pmo_controles_unique UNIQUE (versao_id);


--
-- TOC entry 3163 (class 2606 OID 40818)
-- Name: pmo_plantas_espontaneas uq_pmo_espont_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plantas_espontaneas
    ADD CONSTRAINT uq_pmo_espont_unique UNIQUE (versao_id);


--
-- TOC entry 3183 (class 2606 OID 40916)
-- Name: pmo_integridade uq_pmo_integridade_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integridade
    ADD CONSTRAINT uq_pmo_integridade_unique UNIQUE (versao_id);


--
-- TOC entry 3155 (class 2606 OID 40768)
-- Name: pmo_materia_organica uq_pmo_materia_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_materia_organica
    ADD CONSTRAINT uq_pmo_materia_unique UNIQUE (versao_id);


--
-- TOC entry 3175 (class 2606 OID 40880)
-- Name: pmo_plano_cultivo uq_pmo_plano_cultivo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano_cultivo
    ADD CONSTRAINT uq_pmo_plano_cultivo_unique UNIQUE (versao_id);


--
-- TOC entry 3132 (class 2606 OID 40647)
-- Name: pmo_residuos uq_pmo_residuos_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_residuos
    ADD CONSTRAINT uq_pmo_residuos_unique UNIQUE (versao_id);


--
-- TOC entry 3124 (class 2606 OID 40611)
-- Name: pmo_risco_contaminacao uq_pmo_risco_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_risco_contaminacao
    ADD CONSTRAINT uq_pmo_risco_unique UNIQUE (versao_id);


--
-- TOC entry 3167 (class 2606 OID 40836)
-- Name: pmo_sementes uq_pmo_sementes_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_sementes
    ADD CONSTRAINT uq_pmo_sementes_unique UNIQUE (versao_id);


--
-- TOC entry 3120 (class 2606 OID 40593)
-- Name: pmo_status_organico uq_pmo_status_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_status_organico
    ADD CONSTRAINT uq_pmo_status_unique UNIQUE (versao_id);


--
-- TOC entry 3105 (class 2606 OID 40526)
-- Name: pmo_versao uq_pmo_versao_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_versao
    ADD CONSTRAINT uq_pmo_versao_unique UNIQUE (plano_id, numero_versao);


--
-- TOC entry 3067 (class 2606 OID 40110)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 3069 (class 2606 OID 40108)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 3063 (class 1259 OID 40082)
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- TOC entry 3188 (class 1259 OID 40957)
-- Name: idx_pmo_anexo_versao_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_anexo_versao_id ON public.pmo_anexo USING btree (versao_id);


--
-- TOC entry 3149 (class 1259 OID 40755)
-- Name: idx_pmo_cultivo_versao_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_cultivo_versao_id ON public.pmo_cultivo_item USING btree (versao_id);


--
-- TOC entry 3097 (class 1259 OID 40511)
-- Name: idx_pmo_integrante_plano_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_integrante_plano_id ON public.pmo_integrante_familiar USING btree (plano_id);


--
-- TOC entry 3093 (class 1259 OID 40497)
-- Name: idx_pmo_plano_propriedade_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_plano_propriedade_id ON public.pmo_plano USING btree (propriedade_id);


--
-- TOC entry 3094 (class 1259 OID 40963)
-- Name: idx_pmo_plano_responsavel_pessoa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_plano_responsavel_pessoa_id ON public.pmo_plano USING btree (responsavel_pessoa_id);


--
-- TOC entry 3114 (class 1259 OID 40580)
-- Name: idx_pmo_solo_versao_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_solo_versao_id ON public.pmo_solo USING btree (versao_id);


--
-- TOC entry 3100 (class 1259 OID 40532)
-- Name: idx_pmo_versao_plano_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_versao_plano_id ON public.pmo_versao USING btree (plano_id);


--
-- TOC entry 3101 (class 1259 OID 40533)
-- Name: idx_pmo_versao_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pmo_versao_status ON public.pmo_versao USING btree (status);


--
-- TOC entry 3082 (class 1259 OID 40224)
-- Name: pessoa_cpf_cnpj_uk; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pessoa_cpf_cnpj_uk ON public.pessoa USING btree (cpf_cnpj);


--
-- TOC entry 3195 (class 2606 OID 40176)
-- Name: colheita colheita_cultivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colheita
    ADD CONSTRAINT colheita_cultivo_id_fkey FOREIGN KEY (cultivo_id) REFERENCES public.cultivo(id);


--
-- TOC entry 3199 (class 2606 OID 40249)
-- Name: contas_pagar contas_pagar_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3200 (class 2606 OID 40254)
-- Name: contas_pagar contas_pagar_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3201 (class 2606 OID 40244)
-- Name: contas_pagar contas_pagar_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3202 (class 2606 OID 40259)
-- Name: contas_pagar contas_pagar_propriedade_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_propriedade_id_fkey1 FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3204 (class 2606 OID 40284)
-- Name: contas_receber contas_receber_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3205 (class 2606 OID 40289)
-- Name: contas_receber contas_receber_pessoa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_pessoa_id_fkey FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3206 (class 2606 OID 40294)
-- Name: contas_receber contas_receber_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id);


--
-- TOC entry 3207 (class 2606 OID 40279)
-- Name: contas_receber contas_receber_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3208 (class 2606 OID 40299)
-- Name: contas_receber contas_receber_propriedade_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_propriedade_id_fkey1 FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3192 (class 2606 OID 40128)
-- Name: cultivo cultivo_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultivo
    ADD CONSTRAINT cultivo_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3203 (class 2606 OID 40264)
-- Name: contas_pagar fk_contas_pagar_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT fk_contas_pagar_cliente FOREIGN KEY (cliente_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3209 (class 2606 OID 40304)
-- Name: contas_receber fk_contas_receber_pessoa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT fk_contas_receber_pessoa FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3217 (class 2606 OID 40562)
-- Name: pmo_acesso fk_pmo_acesso_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_acesso
    ADD CONSTRAINT fk_pmo_acesso_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3221 (class 2606 OID 40630)
-- Name: pmo_agua fk_pmo_agua_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_agua
    ADD CONSTRAINT fk_pmo_agua_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3240 (class 2606 OID 40952)
-- Name: pmo_anexo fk_pmo_anexo_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_anexo
    ADD CONSTRAINT fk_pmo_anexo_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3227 (class 2606 OID 40734)
-- Name: pmo_animais fk_pmo_animais_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_animais
    ADD CONSTRAINT fk_pmo_animais_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3216 (class 2606 OID 40544)
-- Name: pmo_area_resumo fk_pmo_area_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_area_resumo
    ADD CONSTRAINT fk_pmo_area_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3237 (class 2606 OID 40899)
-- Name: pmo_armazenamento fk_pmo_arm_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_armazenamento
    ADD CONSTRAINT fk_pmo_arm_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3223 (class 2606 OID 40666)
-- Name: pmo_biodiversidade fk_pmo_biodiv_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_biodiversidade
    ADD CONSTRAINT fk_pmo_biodiv_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3239 (class 2606 OID 40935)
-- Name: pmo_comercializacao fk_pmo_comerc_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_comercializacao
    ADD CONSTRAINT fk_pmo_comerc_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3224 (class 2606 OID 40684)
-- Name: pmo_controles fk_pmo_controles_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_controles
    ADD CONSTRAINT fk_pmo_controles_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3234 (class 2606 OID 40850)
-- Name: pmo_semente_crioula fk_pmo_crioula_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_semente_crioula
    ADD CONSTRAINT fk_pmo_crioula_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3228 (class 2606 OID 40750)
-- Name: pmo_cultivo_item fk_pmo_cultivo_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_cultivo_item
    ADD CONSTRAINT fk_pmo_cultivo_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3231 (class 2606 OID 40801)
-- Name: pmo_insumo_defensivo fk_pmo_defensivo_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_defensivo
    ADD CONSTRAINT fk_pmo_defensivo_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3226 (class 2606 OID 40716)
-- Name: pmo_equipamento fk_pmo_equip_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_equipamento
    ADD CONSTRAINT fk_pmo_equip_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3232 (class 2606 OID 40819)
-- Name: pmo_plantas_espontaneas fk_pmo_espont_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plantas_espontaneas
    ADD CONSTRAINT fk_pmo_espont_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3225 (class 2606 OID 40700)
-- Name: pmo_estrutura fk_pmo_estrutura_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_estrutura
    ADD CONSTRAINT fk_pmo_estrutura_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3230 (class 2606 OID 40785)
-- Name: pmo_insumo_adubacao fk_pmo_insumo_adub_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_insumo_adubacao
    ADD CONSTRAINT fk_pmo_insumo_adub_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3214 (class 2606 OID 40506)
-- Name: pmo_integrante_familiar fk_pmo_integrante_plano; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integrante_familiar
    ADD CONSTRAINT fk_pmo_integrante_plano FOREIGN KEY (plano_id) REFERENCES public.pmo_plano(id) ON DELETE CASCADE;


--
-- TOC entry 3238 (class 2606 OID 40917)
-- Name: pmo_integridade fk_pmo_integridade_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_integridade
    ADD CONSTRAINT fk_pmo_integridade_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3229 (class 2606 OID 40769)
-- Name: pmo_materia_organica fk_pmo_materia_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_materia_organica
    ADD CONSTRAINT fk_pmo_materia_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3235 (class 2606 OID 40863)
-- Name: pmo_origem_semente_item fk_pmo_origem_item_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_origem_semente_item
    ADD CONSTRAINT fk_pmo_origem_item_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3236 (class 2606 OID 40881)
-- Name: pmo_plano_cultivo fk_pmo_plano_cultivo_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano_cultivo
    ADD CONSTRAINT fk_pmo_plano_cultivo_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3212 (class 2606 OID 40492)
-- Name: pmo_plano fk_pmo_plano_propriedade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano
    ADD CONSTRAINT fk_pmo_plano_propriedade FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id) ON DELETE CASCADE;


--
-- TOC entry 3213 (class 2606 OID 40958)
-- Name: pmo_plano fk_pmo_plano_responsavel_pessoa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_plano
    ADD CONSTRAINT fk_pmo_plano_responsavel_pessoa FOREIGN KEY (responsavel_pessoa_id) REFERENCES public.pessoa(id) ON DELETE SET NULL;


--
-- TOC entry 3222 (class 2606 OID 40648)
-- Name: pmo_residuos fk_pmo_residuos_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_residuos
    ADD CONSTRAINT fk_pmo_residuos_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3220 (class 2606 OID 40612)
-- Name: pmo_risco_contaminacao fk_pmo_risco_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_risco_contaminacao
    ADD CONSTRAINT fk_pmo_risco_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3233 (class 2606 OID 40837)
-- Name: pmo_sementes fk_pmo_sementes_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_sementes
    ADD CONSTRAINT fk_pmo_sementes_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3218 (class 2606 OID 40575)
-- Name: pmo_solo fk_pmo_solo_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_solo
    ADD CONSTRAINT fk_pmo_solo_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3219 (class 2606 OID 40594)
-- Name: pmo_status_organico fk_pmo_status_versao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_status_organico
    ADD CONSTRAINT fk_pmo_status_versao FOREIGN KEY (versao_id) REFERENCES public.pmo_versao(id) ON DELETE CASCADE;


--
-- TOC entry 3215 (class 2606 OID 40527)
-- Name: pmo_versao fk_pmo_versao_plano; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pmo_versao
    ADD CONSTRAINT fk_pmo_versao_plano FOREIGN KEY (plano_id) REFERENCES public.pmo_plano(id) ON DELETE CASCADE;


--
-- TOC entry 3198 (class 2606 OID 40393)
-- Name: produto fk_produto_propriedade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT fk_produto_propriedade FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3197 (class 2606 OID 40207)
-- Name: indicador_sustentabilidade indicador_sustentabilidade_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicador_sustentabilidade
    ADD CONSTRAINT indicador_sustentabilidade_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3194 (class 2606 OID 40162)
-- Name: insumo insumo_cultivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_cultivo_id_fkey FOREIGN KEY (cultivo_id) REFERENCES public.cultivo(id);


--
-- TOC entry 3210 (class 2606 OID 40314)
-- Name: pessoa_propriedade pessoa_propriedade_pessoa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa_propriedade
    ADD CONSTRAINT pessoa_propriedade_pessoa_id_fkey FOREIGN KEY (pessoa_id) REFERENCES public.pessoa(id);


--
-- TOC entry 3211 (class 2606 OID 40319)
-- Name: pessoa_propriedade pessoa_propriedade_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa_propriedade
    ADD CONSTRAINT pessoa_propriedade_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3193 (class 2606 OID 40145)
-- Name: pratica_agricola pratica_agricola_cultivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pratica_agricola
    ADD CONSTRAINT pratica_agricola_cultivo_id_fkey FOREIGN KEY (cultivo_id) REFERENCES public.cultivo(id);


--
-- TOC entry 3196 (class 2606 OID 40193)
-- Name: recurso_humano recurso_humano_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurso_humano
    ADD CONSTRAINT recurso_humano_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3191 (class 2606 OID 40111)
-- Name: usuario usuario_propriedade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_propriedade_id_fkey FOREIGN KEY (propriedade_id) REFERENCES public.propriedade(id);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-01-04 19:21:31

--
-- PostgreSQL database dump complete
--

