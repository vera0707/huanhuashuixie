package com.lsx.model;

import com.google.gson.Gson;
import com.lsx.util.DBUtil;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/*******************************************************************************
 * Copyright (c) 2005-2017 Gozap, Inc.
 * connectPro
 * com.lsx.model
 * Created by lishuxia on 2017/11/9 下午4:17.
 * Description: 
 *******************************************************************************/
public class UpdateStu extends HttpServlet {

    protected void processRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();

            resp.setContentType("text/html");
            resp.setHeader("Cache-Control", "no-store");
            resp.setHeader("Pragma","no-cache");
            resp.setDateHeader("Expires",0);


            Student student = new Student();
            int id = Integer.valueOf(req.getParameter("id"));
            String stuName = String.valueOf(req.getParameter("stuName"));
            int stuId = Integer.valueOf(req.getParameter("stuId"));
            int stuSex = Integer.valueOf(req.getParameter("stuSex"));
            String collage = String.valueOf(req.getParameter("collage"));
            String nativePlace = String.valueOf(req.getParameter("nativePlace"));
            int credit = Integer.valueOf(req.getParameter("credit"));
            String email = String.valueOf(req.getParameter("email"));
            String phone = String.valueOf(req.getParameter("phone"));

            student.setStudent(stuName,stuId,stuSex,collage,nativePlace,credit,email,phone);

            DBUtil db = new DBUtil();
            db.getConnection();
            if(db.updateMember(student,id) == 1){
                List result = db.selectMember();
                Gson gson = new Gson();
                out.print(gson.toJson(result));
            }

            db.close();

    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }
}
