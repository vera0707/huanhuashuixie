package com.lsx.util;
import com.lsx.model.Student;
import org.junit.Test;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


/*******************************************************************************
 * Copyright (c) 2005-2017 Gozap, Inc.
 * connectPro
 * com.lsx.util
 * Created by lishuxia on 2017/10/21 下午12:38.
 * Description: 
 *******************************************************************************/
public class DBUtil {

    private Connection conn;
    private PreparedStatement ps;
    private ResultSet rs;
    private Statement statement;
    private static final String url = "jdbc:mysql://172.16.0.10:3300/tem_studet?characterEncodeing=UTF-8";
    private static final String user = "root";
    private static final String password = "gozapdev";

    /**
     * 连接数据库
     */

    public Connection getConnection(){
        try{
            Driver driver = new com.mysql.jdbc.Driver();
            DriverManager.registerDriver(driver);
            conn = DriverManager.getConnection(url,user,password);
        } catch (Exception e){
            throw new RuntimeException("get connection error!" ,e);
        }
        return conn;
    }


    /**
     * 关闭数据库
     */

    public void close(){
        try{
            if(rs != null){
                rs.close();
            }

            if(ps != null){
                ps.close();
            }

            if(conn != null){
                conn.close();
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    /**
     * 添加单条数据
     */
    public int insertMember(Student student){
      int i = 0;
      String sql = "insert into user_table (id,stuName,stuId,stuSex,collage,nativePlace,credit,email,phone) values(?,?,?,?,?,?,?,?,?)";
      try{
          ps = conn.prepareStatement(sql);
          ps.setInt(1,student.getId());
          ps.setString(2,student.getStuName());
          ps.setInt(3,student.getStuId());
          ps.setInt(4,student.getStuSex());
          ps.setString(5,student.getCollage());
          ps.setString(6,student.getNativePlace());
          ps.setInt(7,student.getCredit());
          ps.setString(8,student.getEmail());
          ps.setString(9,student.getPhone());

          i = ps.executeUpdate();
      }catch (SQLException e){
          e.printStackTrace();
      }

      return i;
    }

    /**
     * 删除单条数据
     */

    public int deleteMember(int id){
        int i = 0;
        String sql = "delete from user_table where id =?";
        try {
            ps = conn.prepareStatement(sql);
            ps.setInt(1,id);
            i = ps.executeUpdate();
            System.out.println(i);
        }catch (SQLException e) {
            e.printStackTrace();
        }
        return i;
    }

    /**
     * 删除单条数据
     */

    public int deleteMember(String[] stuId){
        String sql = "delete from user_table where id =?";
        int i = 0;
        try {
            ps = conn.prepareStatement(sql);
            for(int y = 0;y < stuId.length;y++){
                ps.setInt(1,Integer.parseInt(stuId[y]));
                i = ps.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return i;
    }

    /**
     * 查询单条数据
     */
    public List selectMember() {
        String sql = "select * from user_table";
        List<Student> stuList  = selectMethod(sql);
        return stuList;
    }


    /**
     * 模糊查询
     */
    public List selectMember(String str){
        String sql = "select * from user_table where id like '%" + str + "%' or stuName like '%"+ str +"%' or stuId like '%" + str+ "%' or stuSex like "+ (str.equals("男") ? 0 : (str.equals("女") ? 1 : 2)) +" or collage like '%" + str + "%' or nativePlace like '%" + str + "%' or credit like '%" + str + "%' or email  like '%" + str +"%' or phone like '%" + str+ "%'";
        List<Student> stuList  = selectMethod(sql);
        return stuList;
    }


    private List<Student> selectMethod(String sql) {
        List<Student> stuList = new ArrayList<Student>();
        try {
            ps = conn.prepareStatement(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            rs = ps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            while (rs.next()){
                Student stu = new Student();
                stu.setId(rs.getInt("id"));
                stu.setStuName(rs.getString("stuName"));
                stu.setStuId(rs.getInt("stuId"));
                stu.setStuSex(rs.getInt("stuSex"));
                stu.setCollage(rs.getString("collage"));
                stu.setNativePlace(rs.getString("nativePlace"));
                stu.setCredit(rs.getInt("credit"));
                stu.setEmail(rs.getString("email"));
                stu.setPhone(rs.getString("phone"));
                stuList.add(stu);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return stuList;
    }


    /**
     * 修改数据
     */

    public int updateMember(Student student,int id)  {
        int i = 0;
        String sql="update user_table set stuName=?,stuId=?,stuSex=?,collage=?,nativePlace=?,credit=?,email=?,phone=? where id=?";

        try{
            ps = conn.prepareStatement(sql);
            ps.setString(1,student.getStuName());
            ps.setInt(2,student.getStuId());
            ps.setInt(3,student.getStuSex());
            ps.setString(4,student.getCollage());
            ps.setString(5,student.getNativePlace());
            ps.setInt(6,student.getCredit());
            ps.setString(7,student.getEmail());
            ps.setString(8,student.getPhone());
            ps.setInt(9,id);
            i = ps.executeUpdate();
        }catch (SQLException e){
            e.printStackTrace();
        }
        return i;
    }


}
