package com.shp.board.service.impl;

import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shp.board.dao.BoardDao;
import com.shp.board.domain.Board;
import com.shp.board.service.BoardService;

// 스프링 IoC 컨테이너가 관리하는 객체 중에서 
// 비즈니스 로직을 담당하는 객체는 
// 특별히 그 역할을 표시하기 위해 @Component 대신에 @Service 애노테이션을 붙인다.
// 이렇게 애노테이션으로 구분해두면 나중에 애노테이션으로 객체를 찾을 수 있다.
@Service
public class BoardServiceImpl implements BoardService {
  
  @Autowired
  BoardDao boardDao;
  
  @Override
  public List<Board> list(int pageNo, int pageSize, String keyword) throws Exception {
    
    HashMap<String,Object> params = new HashMap<>();
    params.put("size", pageSize);
    
    // 전 페이지의 마지막 번호
    // 현재 페이지 - 1 * 페이지 게시글 수
    params.put("rowNo", (pageNo - 1) * pageSize);
    
    if (keyword != "" && keyword != null) {
      params.put("keyword", keyword);
    }
    
    return boardDao.findAll(params);
  }
  
  @Override
  public int add(Board board) throws Exception {
    // 이 메서드도 하는 일이 없다.
    // 그래도 일관된 프로그래밍을 위해 Command 객체는 항상 Service 객체를 경유하여 DAO를 사용해야 한다.
    return boardDao.insert(board);
  }
  
  @Override
  public Board get(int no) throws Exception {
    // 이제 조금 서비스 객체가 뭔가를 하는 구만.
    // Command 객체는 데이터를 조회한 후 조회수를 높이는 것에 대해 신경 쓸 필요가 없어졌다.
    Board board = boardDao.findByNo(no);
    if (board != null) {
      boardDao.increaseCount(no);
    }
    return board;
  }
  
  @Override
  public int update(Board board) throws Exception {
    // 이 메서드도 별로 할 일이 없다.
    // 그냥 DAO를 실행시키고 리턴 값을 그대로 전달한다.
    return boardDao.update(board);
  }
  
  @Override
  public int delete(int no) throws Exception {
    // 이 메서드도 그냥 DAO에 명령을 전달하는 일을 한다.
    // 그래도 항상 Command 객체는 이 Service 객체를 통해서 데이터를 처리해야 한다.
    return boardDao.delete(no);
  }
  
  @Override
  public int size(String keyword) throws Exception {
    // 전체 게시물의 개수
    return boardDao.countAll(keyword);
  }

  @Override
  public boolean passwordCheck(int no, String password) throws Exception {
    HashMap<String,Object> paramMap = new HashMap<>();
    paramMap.put("no", no);
    paramMap.put("password", password);
    
    return boardDao.findPassword(paramMap) > 0 ? true : false;
  }
}







