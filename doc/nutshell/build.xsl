<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="docbook-xsl/html/onechunk.xsl" />

    <xsl:param name="callout.graphics.path">img/callouts/</xsl:param>

    <xsl:param name="html.stylesheet" select="'style.css'" />
    <xsl:param name="highlight.source" select="1" />
    <xsl:param name="highlight.default.language" select="'javascript'" />

    <xsl:template name="user.header.content">
        <link href="js/syntaxhighlighter/shCoreEclipse.css" type="text/css" rel="stylesheet" />
        <link href="js/syntaxhighlighter/shThemeEclipse.css" type="text/css" rel="stylesheet" />

        <script src="js/syntaxhighlighter/shCore.js" type="text/javascript"></script>
        <script src="js/syntaxhighlighter/shBrushPlain.js" type="text/javascript"></script>
        <script src="js/syntaxhighlighter/shBrushJScript.js" type="text/javascript"></script>
        <script src="js/syntaxhighlighter/shBrushXml.js" type="text/javascript"></script>
        <script src="js/syntaxhighlighter/shBrushSass.js" type="text/javascript"></script>

        <script type="text/javascript">SyntaxHighlighter.all();</script>
    </xsl:template>

    <xsl:template match="*[@language]" mode="class.value">
        <xsl:value-of select="concat(@language, ' ', local-name(.))"/>
    </xsl:template>

</xsl:stylesheet>
