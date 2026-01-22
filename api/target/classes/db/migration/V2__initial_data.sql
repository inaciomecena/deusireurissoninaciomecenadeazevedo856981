insert into usuario (username, senha_hash, roles)
values ('admin', '{noop}123456', 'ROLE_ADMIN');

insert into artista (nome, tipo) values ('Serj Tankian', 'SOLO');
insert into artista (nome, tipo) values ('Mike Shinoda', 'SOLO');
insert into artista (nome, tipo) values ('Michel Teló', 'SOLO');
insert into artista (nome, tipo) values ('Guns N'' Roses', 'BANDA');

insert into album (artista_id, titulo) values ((select id from artista where nome = 'Serj Tankian'), 'Harakiri');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Serj Tankian'), 'Black Blooms');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Serj Tankian'), 'The Rough Dog');

insert into album (artista_id, titulo) values ((select id from artista where nome = 'Mike Shinoda'), 'The Rising Tied');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Mike Shinoda'), 'Post Traumatic');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Mike Shinoda'), 'Post Traumatic EP');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Mike Shinoda'), 'Where''d You Go');

insert into album (artista_id, titulo) values ((select id from artista where nome = 'Michel Teló'), 'Bem Sertanejo');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Michel Teló'), 'Bem Sertanejo - O Show (Ao Vivo)');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Michel Teló'), 'Bem Sertanejo - (1ª Temporada) - EP');

insert into album (artista_id, titulo) values ((select id from artista where nome = 'Guns N'' Roses'), 'Use Your Illusion I');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Guns N'' Roses'), 'Use Your Illusion II');
insert into album (artista_id, titulo) values ((select id from artista where nome = 'Guns N'' Roses'), 'Greatest Hits');

