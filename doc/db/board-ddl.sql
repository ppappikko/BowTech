-- 게시판 테이블 삭제
drop table if exists bow_board restrict;

-- 게시물 댓글 테이블 삭제
drop table if exists bow_comment restrict;

-- 게시물 첨부파일 테이블 삭제
drop table if exists bow_file restrict;


-- 게시판 테이블 생성
create table bow_board (
  board_id int not null primary key auto_increment,
  titl varchar(255) not null,
  conts text null,
  cdt datetime not null default now(),
  udt datetime null,
  vw_cnt int null default 0,
  usr varchar(20) not null,
  pwd varchar(255) not null default '1111',
  cmt_cnt int null default 0,
  is_del boolean null default false,
  atch_file_cnt int null default 0
);

-- 게시물 댓글 테이블 생성
create table bow_comment (
  comment_id int not null primary key auto_increment,
  conts text not null,
  cdt datetime not null default now(),
  udt datetime null,
  usr varchar(20) not null,
  pwd varchar(20) not null default '1111',
  board_id int not null,
  constraint fk_bow_comment foreign key (board_id) references bow_board(board_id)
);

-- 게시물 첨부파일 테이블 생성
create table bow_file (
  file_id int not null primary key auto_increment,
  file_ext varchar(10) not null,
  file_path varchar(255) not null,
  up_dt datetime not null default now(),
  board_id int not null,
  constraint bow_file foreign key (board_id) references bow_board(board_id)
);








