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
import com.shp.board.domain.Board;
import com.shp.board.service.BoardService;


// AJAX 기반 JSON 데이터를 다루는 컨트롤러
@RestController
@RequestMapping("/board")
public class BoardController {
  
  // DI
  @Autowired BoardService boardService;
  
  @PostMapping("add")
  public Object add(Board board) {
    HashMap<String,Object> content = new HashMap<>();
    
    System.out.println(board);
    try {
      
      if (board.getTitle() == "" || 
          board.getUser() == "" ||
          board.getPassword() == "" ||
          board.getContents() == ""
          ) {
        throw new Exception("제목, 작성자, 비밀번호, 내용을 입력하세요");
      }
      
      boardService.add(board);
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
      if (boardService.delete(no) == 0) 
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      content.put("status", "success");
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  @GetMapping("detail")
  public Object detail(int no) {
    
    HashMap<String,Object> content = new HashMap<>();
    Board board = new Board();
    
    try {
      board = boardService.get(no);
      if (board == null) 
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      
      content.put("status", "success");
      content.put("board", board);
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  // 리스트 
  @GetMapping("list")
  public Object list(
      @RequestParam(defaultValue="1") int pageNo,
      @RequestParam(defaultValue="10") int pageSize,
      @RequestParam(defaultValue="") String keyword) {
    
    if (pageSize < 10 || pageSize > 10) 
      pageSize = 10;
    
    HashMap<String,Object> content = new HashMap<>();
    try {
      // 전체 게시물의 개수
      int rowCount = boardService.size(keyword);
      
      // 총 페이지 수
      int totalPage = rowCount / pageSize;
      if (rowCount % pageSize > 0)
        totalPage++;
      
      if (pageNo < 1) 
        pageNo = 1;
      else if (pageNo > totalPage)
        pageNo = totalPage;
      
      List<Board> boards = boardService.list(pageNo, pageSize, keyword);
      
      content.put("status", "success");
      content.put("list", boards);
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
  public Object update(Board board) {
    HashMap<String,Object> content = new HashMap<>();
    try {
      
      if (board.getTitle() == "" || 
          board.getContents() == ""
          ) {
        throw new Exception("제목 또는 내용을 입력하세요.");
      }
      
      if (boardService.update(board) == 0) 
        throw new RuntimeException("해당 번호의 게시물이 없습니다.");
      content.put("status", "success");
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    return content;
  }
  
  @PostMapping("passwordcheck")
  public Object passwordcheck(Board board) {
    
    System.out.println(board);
    boolean result = false;
    Map<Object, Object> content = new HashMap<Object, Object>();
    
    try {
      result = boardService.passwordCheck(board.getNo(), board.getPassword());
      content.put("status", "success");
      content.put("result", result);
      
    } catch (Exception e) {
      content.put("status", "fail");
      content.put("message", e.getMessage());
    }
    
    return content;
  }
  
}










