import React, { useContext, useState, useCallback, useMemo, Suspense } from "react";
import { Card, Typography, Tag, Tooltip, Space, Row, Col, Badge, Button, ConfigProvider, theme } from "antd";
import { LinkOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";
import copy from "copy-text-to-clipboard";
import themeConfig from "@site/src/pages/_components/themeConfig";
import { AuthContext } from "@site/src/pages/_components/AuthContext";
import { updateCopyCount } from "@site/src/api";
import { formatCopyCount } from "@site/src/pages/_components/utils";

const ShareButtons = React.lazy(() => import("./ShareButtons"));
const Comments = React.lazy(() => import("./Comments"));

const { Paragraph } = Typography;

const styles = {
  container: { marginTop: "20px" },
  badge: { backgroundColor: "#52c41a" },
  remark: { color: "#595959" },
  commentInfo: {
    color: "gray",
    fontSize: "0.9em",
    marginTop: "20px",
  },
};

function PromptPage({ prompt }) {
  const { userAuth } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const { i18n } = useDocusaurusContext();
  const currentLanguage = i18n.currentLocale.split("-")[0];
  const [mainPrompt, setMainPrompt] = useState(prompt[currentLanguage].prompt);

  // 使用 useMemo 缓存计算值
  const { shareUrl, title, remark, weight, website, tags, isDarkMode } = useMemo(
    () => ({
      shareUrl: typeof window !== "undefined" ? window.location.href : "",
      title: prompt[currentLanguage].title,
      remark: prompt[currentLanguage].remark,
      weight: prompt.weight,
      website: prompt.website,
      tags: prompt.tags,
      isDarkMode: typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark",
    }),
    [prompt, currentLanguage]
  );

  const handleParagraphClick = useCallback(() => {
    setMainPrompt((prev) => (currentLanguage !== "en" && prev === prompt[currentLanguage].prompt ? prompt[currentLanguage].description : prompt[currentLanguage].prompt));
  }, [prompt, currentLanguage]);

  const handleCopyClick = useCallback(async () => {
    copy(prompt[currentLanguage].prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await updateCopyCount(prompt.id);
  }, [prompt, currentLanguage]);

  return (
    <ConfigProvider
      theme={{
        ...themeConfig,
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}>
      <Layout title={title} description={remark}>
        <Row justify="center" style={styles.container}>
          <Col xs={24} sm={22} md={20} lg={18} xl={16}>
            <Card
              className="shadow--md"
              title={
                <>
                  {title} <Badge count={`${formatCopyCount(weight)}`} style={styles.badge} />
                </>
              }
              extra={
                <Space>
                  <Button icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopyClick}>
                    {copied ? <Translate id="theme.CodeBlock.copied">已复制</Translate> : <Translate id="theme.CodeBlock.copy">复制</Translate>}
                  </Button>
                  {website && (
                    <Link to={website}>
                      <LinkOutlined />
                    </Link>
                  )}
                </Space>
              }>
              <Paragraph style={styles.remark}>👉 {remark}</Paragraph>
              <Tooltip title={<Translate id="tooltip.switchLang">点击切换显示语言</Translate>}>
                <Paragraph onClick={handleParagraphClick} style={{ cursor: "pointer", maxHeight: "500px", overflowY: "auto", minHeight: "100px" }}>
                  {mainPrompt}
                </Paragraph>
              </Tooltip>
              <Space wrap>
                {tags.map((tag) => (
                  <Link to={`/?tags=${tag}`} key={tag}>
                    <Tag color="blue">{tag}</Tag>
                  </Link>
                ))}
              </Space>
              <Paragraph style={styles.commentInfo}>
                <Translate id="comments.info">请在下方回复您对本提示词的意见、想法或分享。</Translate>
              </Paragraph>

              <Suspense fallback={null}>
                <ShareButtons shareUrl={shareUrl} title={`${title}: ${remark}`} popOver={true} />
                <Comments pageId={prompt.id} currentUserId={userAuth?.data?.id || 0} type="page" />
              </Suspense>
            </Card>
          </Col>
        </Row>
      </Layout>
    </ConfigProvider>
  );
}

// 使用 memo 优化整个组件的重渲染
export default React.memo(PromptPage);
