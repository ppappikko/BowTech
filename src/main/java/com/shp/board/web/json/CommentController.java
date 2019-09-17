package com.shp.board.web.json;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.shp.board.domain.Comment;
import com.shp.board.service.CommentService;


// AJAX 기반 JSON 데이터를 다루는 컨트롤러
@RestController
@RequestMapping("/comment")
public class CommentController {
  
  // DI
  @Autowired CommentService commentService;
  
  @PostMapping("add")
  public Object add(Comment comment) {
    HashMap<String,Object> content = new HashMap<>();
    
    try {
      
      if (comment.getUser() == "" ||
          comment.getPassword() == "" ||
          comment.getContents() == ""
          ) {
        throw new Exception("제목, 작성자, 비밀번호, 내용을 입력하세요");
      }
      
      commentService.add(comment);
      content.put("status", "success");
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  @GetMapping("delete")
  public Object delete(int no) {
  
    HashMap<String,Object> content = new HashMap<>();
    
    try {
      if (commentService.delete(no) == 0) 
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      content.put("status", "success");
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  // 리스트 
  @SuppressWarnings("unchecked")
  @GetMapping("list")
  public Object list(
      @RequestParam int boardNo,
      @RequestParam int pageNo,
      @RequestParam(defaultValue="5") int pageSize) {

    if (pageSize < 5 || pageSize > 5) 
      pageSize = 5;
    
    HashMap<String,Object> content = new HashMap<>();
    try {
      // 전체 게시물의 개수
      int rowCount = commentService.size(boardNo);
      
      if (rowCount == 0) {
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      }
      
      // 총 페이지 수
      int totalPage = rowCount / pageSize;
      if (rowCount % pageSize > 0)
        totalPage++;
      
      if (pageNo < 1) 
        pageNo = 1;
      else if (pageNo > totalPage)
        pageNo = totalPage;
      
      Map<String,Object> list = commentService.list(boardNo, pageNo, pageSize);
      List<Comment> parentList = (List<Comment>) list.get("parentList");
      List<Comment> childrenList = (List<Comment>) list.get("childrenList");
      
      // 댓글의 답글 수
      int totalReplyCount = 0;
      
      for (Comment p : parentList) {
        for (Comment c : childrenList) {
          if (p.getNo() == c.getParentNo()) {
            totalReplyCount++;
          }
        }
        p.setReplyCount(totalReplyCount);
        totalReplyCount = 0;
      }
      
      content.put("status", "success");
      content.put("parentList", parentList);
      content.put("childrenList", childrenList);
      content.put("pageNo", pageNo);
      content.put("pageSize", pageSize);
      content.put("totalPage", totalPage);
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  @PostMapping("update")
  public Object update(Comment comment) {
    HashMap<String,Object> content = new HashMap<>();
    try {
      
      if (comment.getContents() == "") {
        throw new Exception("내용을 입력하세요.");
      }
      
      if (commentService.update(comment) == 0) 
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      content.put("status", "success");
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  @PostMapping("passwordcheck")
  public Object passwordcheck(Comment comment) {
    
    boolean result = false;
    Map<Object, Object> content = new HashMap<Object, Object>();
    
    try {
      result = commentService.passwordCheck(comment.getNo(), comment.getPassword());
      content.put("status", "success");
      content.put("result", result);
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    
    return content;
  }
  
}










