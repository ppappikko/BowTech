package com.shp.board.service;

import java.util.List;
import com.shp.board.domain.Board;

public interface BoardService {
  List<Board> list(int pageNo, int pageSize, String keyword) throws Exception;
  int add(Board board) throws Exception;
  Board get(int no) throws Exception;
  int update(Board board) throws Exception;
  int delete(int no) throws Exception;
  int size(String keyword) throws Exception;
  boolean passwordCheck(int no, String password) throws Exception;
}
