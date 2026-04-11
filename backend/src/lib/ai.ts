import OpenAI from 'openai';
import type { RawArticle, VerifiedArticle, TrendItem } from './types.js';
import db from './db.js';

function getClient(): OpenAI | null {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key,
  });
}

function getModel(): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'ai_model'").get() as { value: string } | undefined;
  return row?.value || 'deepseek/deepseek-chat-v3.1';
}

export async function verifyArticle(article: RawArticle, keyword: string): Promise<VerifiedArticle> {
  const client = getClient();
  if (!client) {
    return { ...article, score: 50, verified: false, reason: 'AI not configured', summary: article.snippet };
  }

  try {
    const resp = await client.chat.completions.create({
      model: getModel(),
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `你是一个科技新闻真伪鉴别专家。用户会给你一篇文章信息和一个关键词，请判断：
1. 这篇文章是否是真实的科技资讯（而非标题党/广告/假新闻）
2. 与关键词的相关度（0-100分）
3. 一句话中文摘要

返回 JSON：{"score": number, "verified": boolean, "reason": "string", "summary": "string"}`,
        },
        {
          role: 'user',
          content: `关键词: ${keyword}\n标题: ${article.title}\n来源: ${article.source}\n摘要: ${article.snippet}\nURL: ${article.url}`,
        },
      ],
    });

    const raw = resp.choices[0]?.message?.content || '';
    // Strip <think>...</think> tags from thinking models
    const text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Extract JSON from possible markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return {
      ...article,
      score: Math.min(100, Math.max(0, parsed.score || 0)),
      verified: parsed.verified ?? false,
      reason: parsed.reason || '',
      summary: parsed.summary || article.snippet,
    };
  } catch (e) {
    console.error('[AI] verify error:', e);
    return { ...article, score: 0, verified: false, reason: 'AI analysis failed', summary: article.snippet };
  }
}

export async function analyzeTrends(articles: RawArticle[], domain: string): Promise<TrendItem[]> {
  const client = getClient();
  if (!client || articles.length === 0) return [];

  try {
    const articleList = articles
      .slice(0, 20)
      .map((a, i) => `${i + 1}. [${a.source}] ${a.title} - ${a.snippet.slice(0, 100)}`)
      .join('\n');

    const resp = await client.chat.completions.create({
      model: getModel(),
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `你是一个科技趋势分析专家。根据用户提供的文章列表，分析当前"${domain}"领域的热点趋势。
将文章归纳为3-5个趋势类别。

返回 JSON：{"trends": [{"category": "string", "title": "string", "summary": "string", "heat_level": 1-5, "sources": ["url1","url2"]}]}`,
        },
        {
          role: 'user',
          content: `领域: ${domain}\n\n文章列表:\n${articleList}`,
        },
      ],
    });

    const raw = resp.choices[0]?.message?.content || '';
    const text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return parsed.trends || [];
  } catch (e) {
    console.error('[AI] trends error:', e);
    return [];
  }
}
