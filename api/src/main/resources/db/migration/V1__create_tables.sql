create table usuario (
    id bigserial primary key,
    username varchar(100) not null unique,
    senha_hash varchar(255) not null,
    roles varchar(200)
);

create table artista (
    id bigserial primary key,
    nome varchar(200) not null unique,
    tipo varchar(20),
    data_criacao timestamp not null default now()
);

create table album (
    id bigserial primary key,
    artista_id bigint not null references artista(id),
    titulo varchar(200) not null,
    ano_lancamento integer,
    data_criacao timestamp not null default now()
);

create table album_capa (
    id bigserial primary key,
    album_id bigint not null references album(id),
    objeto_minio varchar(300) not null,
    content_type varchar(100) not null,
    tamanho_bytes bigint not null,
    data_upload timestamp not null default now()
);

create table regional (
    id bigserial primary key,
    codigo_externo integer not null,
    nome varchar(200) not null,
    ativo boolean not null,
    data_criacao timestamp not null default now(),
    data_inativacao timestamp
);

