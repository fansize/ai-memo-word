/**
 * 字典数据获取 API
 * 功能：根据考试类型获取对应的词典数据
 * 请求参数：type - 考试类型（如 CET4、CET6 等）
 * 返回数据：词典数据数组及总数量
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { DictType } from '@/app/types/types';

/**
 * GET 请求处理函数
 * 处理流程：
 * 1. 获取并验证考试类型参数
 * 2. 根据考试类型读取对应的词典文件
 * 3. 返回词典数据和单词数量
 */
export async function GET(request: NextRequest) {
  try {
    // 从 URL 查询参数中获取考试类型
    // 例如：/api/dictFetch?type=cet4 -> CET4
    const searchParams = request.nextUrl.searchParams;
    const examType = searchParams.get('type')?.toLocaleUpperCase();
    
    // 验证考试类型是否有效
    // 检查是否存在且是否为支持的考试类型（在 DictType 枚举中定义）
    if (!examType || !(examType in DictType)) {
      return NextResponse.json(
        { error: 'Invalid exam type' },
        { status: 400 }
      );
    }

    // 构建词典文件路径
    // 文件命名规则：考试类型_T.json（如 CET4_T.json）
    // 存放位置：项目根目录的 public/dicts 文件夹下
    const filePath = path.join(process.cwd(), `public/dicts/${examType}_T.json`);
    
    try {
      // 读取并解析词典文件
      // 文件格式：JSON 数组，包含单词信息
      const fileData = await fs.readFile(filePath, 'utf-8');
      const dictionaryData = JSON.parse(fileData);
      
      // 返回成功响应
      // dictionary: 词典数据数组
      // count: 词典中的单词总数
      return NextResponse.json({ 
        dictionary: dictionaryData,
        count: dictionaryData.length
      });
    } catch (err) {
      // 文件读取错误处理
      // 可能原因：文件不存在、文件损坏、权限问题等
      console.error('Error reading dictionary file:', err);
      return NextResponse.json(
        { error: `Dictionary for ${examType} not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    // 全局错误处理
    // 捕获其他未预期的错误
    console.error('Error in dictFetch API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dictionary data' },
      { status: 500 }
    );
  }
}
