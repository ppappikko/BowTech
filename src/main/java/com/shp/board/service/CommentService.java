package com.shp.board.service;

import java.util.Map;
import com.shp.board.domain.Comment;

public interface CommentService {
  Map<String,Object> list(int parentNo,int pageNo, int pageSize) throws Exception;
  int add(Comment comment) throws Exception;
  int update(Comment comment) throws Exception;
  int delete(int no) throws Exception;
  int size(int boardNo) throws Exception;
  boolean passwordCheck(int no, String password) throws Exception;
}
