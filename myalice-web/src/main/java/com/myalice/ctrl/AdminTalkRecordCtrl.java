package com.myalice.ctrl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import java.io.OutputStream;
import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.myalice.domain.TalkRecord;
import com.myalice.services.TalkRecordService;

@RestController
@RequestMapping("/admin/talkrecord")
@EnableSwagger2
@Api(value = "系統聊天記錄接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class AdminTalkRecordCtrl {
    protected static Logger logger = org.slf4j.LoggerFactory.getLogger("ctrl");

    @Autowired
    protected TalkRecordService talkRecordService;

	@ApiOperation(value = "獲取聊天記錄", response = PageInfo.class)
    @RequestMapping("data")
    public PageInfo<TalkRecord> data(Integer pageNum, TalkRecord record) {
        pageNum = null == pageNum ? 1 : pageNum;
        Page<TalkRecord> list = talkRecordService.list(pageNum, record);
        return new PageInfo<>(list);
    }

	@ApiOperation(value = "導出聊天記錄")
    @RequestMapping("data/export")
    public void exportExcel(TalkRecord record, HttpServletResponse response) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String[] headers = new String[]{"咨询人", "提问内容", "创建时间", "回复内容", "状态"};
            // 声明一个工作薄
            SXSSFWorkbook workbook = new SXSSFWorkbook(1000);//缓存最大值
            workbook.setCompressTempFiles(true);
            SXSSFSheet sheet1 = workbook.createSheet("咨询记录");
            int excelRow = 0;
            //标题行
            SXSSFRow titleRow = sheet1.createRow(excelRow++);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = titleRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            for (int pageNum = 1; pageNum < 10000; pageNum++) {
                Page<TalkRecord> list = talkRecordService.list(pageNum, record);
                if (list == null || list.size() == 0) {
                    break;
                }
                for (TalkRecord talkRecord : list) {
                    SXSSFRow row = sheet1.createRow(excelRow++);
                    SXSSFCell c1 = row.createCell(0);
                    c1.setCellValue(talkRecord.getUserId());
                    SXSSFCell c2 = row.createCell(1);
                    c2.setCellValue(talkRecord.getContent());
                    SXSSFCell c3 = row.createCell(2);
                    c3.setCellValue(formatter.format(talkRecord.getCreateTime()));
                    SXSSFCell c4 = row.createCell(3);
                    c4.setCellValue(talkRecord.getReply());
                    SXSSFCell c5 = row.createCell(4);
                    c5.setCellValue(talkRecord.getReplyType() == 1 ? "已回复" : "未回复");
                }
            }
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename=talk-record.xlsx");
            OutputStream ouputStream = response.getOutputStream();

            workbook.write(ouputStream);
            ouputStream.flush();
            ouputStream.close();
            workbook.close();
        } catch (Exception e) {
            logger.error("导出文件出错：", e);
        }
    }
}
