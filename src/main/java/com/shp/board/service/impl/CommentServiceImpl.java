package com.shp.board.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shp.board.dao.CommentDao;
import com.shp.board.domain.Comment;
import com.shp.board.service.CommentService;

// 스프링 IoC 컨테이너가 관리하는 객체 중에서 
// 비즈니스 로직을 담당하는 객체는 
// 특별히 그 역할을 표시하기 위해 @Component 대신에 @Service 애노테이션을 붙인다.
// 이렇게 애노테이션으로 구분해두면 나중에 애노테이션으로 객체를 찾을 수 있다.
@Service
public class CommentServiceImpl implements CommentService {
  
  @Autowired
  CommentDao commentDao;
  
  @Override
  public Map<String,Object> list(int boardNo, int pageNo, int pageSize) throws Exception {
    
    HashMap<String,Object> params = new HashMap<>();
    params.put("boardNo", boardNo);
    params.put("size", pageSize);
    
    // 전 페이지의 마지막 번호
    // 현재 페이지 - 1 * 페이지 게시글 수
    params.put("rowNo", (pageNo - 1) * pageSize);
    
    List<Comment> parentList = commentDao.findAll(params);
    List<Comment> childrenList = commentDao.findAllChildren(boardNo);
    Map<String,Object> map = new HashMap<>();
    map.put("parentList", parentList);
    map.put("childrenList", childrenList);
    
    // 정리된 리스트 리턴
    return map;
  }
  
  @Override
  public int add(Comment comment) throws Exception {
    System.out.println(comment);
    
    if (comment.getParentNo() != 0) {
      
      // 댓글에 댓글 작성시
      // 추가할 댓글의 부모 댓글 정보를 가져온다.
      Comment commentInfo = commentDao.findByParentNo(comment.getParentNo());
      comment.setDepth(commentInfo.getDepth());
      comment.setGroupOrd(commentInfo.getGroupOrd() + 1);
      commentDao.updateGroupOrd(commentInfo);
      
    } else {
      
      // 게시글에 일반 댓글 작성시
      int reOrder = commentDao.findOrderByBoardNo(comment.getBoardNo());
      comment.setGroupOrd(reOrder);
      System.out.println(comment.getGroupOrd());
    }
    System.out.println(comment);
    return commentDao.insert(comment);
  }
  
  @Override
  public int update(Comment comment) throws Exception {
    // 이 메서드도 별로 할 일이 없다.
    // 그냥 DAO를 실행시키고 리턴 값을 그대로 전달한다.
    return commentDao.update(comment);
  }
  
  @Override
  public int delete(int no) throws Exception {
    // 이 메서드도 그냥 DAO에 명령을 전달하는 일을 한다.
    // 그래도 항상 Command 객체는 이 Service 객체를 통해서 데이터를 처리해야 한다.
    commentDao.updateGroupOrdDelete(no);
    return commentDao.delete(no);
  }
  
  @Override
  public int size(int boardNo) throws Exception {
    // 전체 게시물의 개수
    return commentDao.countAll(boardNo);
  }

  @Override
  public boolean passwordCheck(int no, String password) throws Exception {
    HashMap<String,Object> paramMap = new HashMap<>();
    paramMap.put("no", no);
    paramMap.put("password", password);
    
    return commentDao.findPassword(paramMap) > 0 ? true : false;
  }
}







