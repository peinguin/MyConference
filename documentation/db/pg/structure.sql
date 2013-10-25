DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS decisions CASCADE;
DROP TABLE IF EXISTS streams CASCADE;
DROP TABLE IF EXISTS timeslots CASCADE;
DROP TYPE IF EXISTS decision;

CREATE TABLE users (
  id SERIAL PRIMARY KEY ,
  email character varying(255),
  password character varying(255),
  twitter INTEGER DEFAULT null,
  facebook INTEGER DEFAULT null,
  google character varying(255) DEFAULT null,
  linkedin character varying(255) DEFAULT NULL
);
CREATE TYPE decision AS ENUM ('go', 'favorite', 'not go');
CREATE TABLE conferences (
  id SERIAL PRIMARY KEY  NOT NULL ,
  title character varying(255) NOT NULL,
  description TEXT DEFAULT null,
  datetime timestamp with time zone DEFAULT null,
  place character varying(255) DEFAULT null,
  location character varying(255) DEFAULT null,
  site character varying(255) DEFAULT null,
  logo character varying(255) DEFAULT null,
  facebook character varying(255) DEFAULT null,
  twitter character varying(255) DEFAULT null,
  telephone character varying(32) DEFAULT null,
  cost numeric(6, 2) DEFAULT null,
  file character varying(255) DEFAULT null
);
CREATE TABLE decisions (
  id SERIAL PRIMARY KEY NOT NULL  UNIQUE ,
  decision decision NOT NULL ,
  conference_id INTEGER NOT NULL references conferences(id),
  user_id INTEGER NOT NULL references users(id)
);
CREATE TABLE streams (
  id SERIAL PRIMARY KEY NOT NULL  UNIQUE ,
  title character varying(255) NOT NULL ,
  conference_id INTEGER NOT NULL references conferences(id)
);
CREATE TABLE timeslots (
  id SERIAL PRIMARY KEY  NOT NULL ,
  time character varying(255) NOT NULL,
  speaker character varying(255) NOT NULL ,
  stream_id INTEGER NOT NULL  DEFAULT (null) references streams(id),
  title character varying(255)
);
