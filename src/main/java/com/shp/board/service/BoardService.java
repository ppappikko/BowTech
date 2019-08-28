package com.shp.board.service;

import java.util.List;
import com.shp.board.domain.Board;

public interface BoardService {
  List<Board> list(int pageNo, int pageSize);
  List<Board> list();
  int add(Board board);
  Board get(int no);
  int update(Board board);
  int delete(int no);
  int size();
}
