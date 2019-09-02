package com.shp.board.dao;

import java.util.List;
import java.util.Map;
import com.shp.board.domain.Board;

public interface BoardDao {
  int insert(Board board) throws Exception;
  List<Board> findAll(Map<String,Object> params) throws Exception;
  Board findByNo(int no) throws Exception;
  int increaseCount(int no) throws Exception;
  int update(Board board) throws Exception;
  int delete(int no) throws Exception;
  int countAll(String keyword) throws Exception;
  int findPassword(Map<String,Object> params) throws Exception;
}







