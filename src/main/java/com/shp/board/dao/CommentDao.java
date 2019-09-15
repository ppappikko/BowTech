package com.shp.board.dao;

import java.util.List;
import java.util.Map;
import com.shp.board.domain.Comment;

public interface CommentDao {
  int insert(Comment comment) throws Exception;
  List<Comment> findAll(Map<String,Object> params) throws Exception;
  Comment findByParentNo(int no) throws Exception;
  int findOrderByBoardNo(int boardNo) throws Exception;
  int update(Comment comment) throws Exception;
  int updateGroupOrd(Comment comment) throws Exception;
  int delete(int no) throws Exception;
  int countAll(int boardNo) throws Exception;
  int findPassword(Map<String,Object> params) throws Exception;
}







