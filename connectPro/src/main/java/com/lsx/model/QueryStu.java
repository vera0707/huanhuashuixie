package com.lsx.model;

import com.lsx.util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.util.List;

/*******************************************************************************
 * Copyright (c) 2005-2017 Gozap, Inc.
 * connectPro
 * com.lsx.model
 * Created by lishuxia on 2017/11/9 上午10:47.
 * Description: 
 *******************************************************************************/
@WebServlet("/student")
public class QueryStu extends HttpServlet {
    public static void main(String[] args){
        System.out.println("进入学生管理系统");
    }

    protected void processRequest(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
        DBUtil db = new DBUtil();
        Connection conn = db.getConnection();
        List result = db.selectMember();
        db.close();

        System.out.println(result);
        req.setCharacterEncoding("UTF-8");
        req.setAttribute("data",result);
        req.getRequestDispatcher("/public/src/view/student.jsp").forward(req, resp);

    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)throws ServletException,IOException {
        processRequest(req,resp);
    }

}