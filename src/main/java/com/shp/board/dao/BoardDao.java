package com.shp.board.dao;

import java.util.List;
import java.util.Map;
import com.shp.board.domain.Board;

public interface BoardDao {
  int insert(Board board);
  List<Board> findAllWithPage(Map<String,Object> params);
  List<Board> findAll();
  Board findByNo(int no);
  int increaseCount(int no);
  int update(Board board);
  int delete(int no);
  int countAll();
}







