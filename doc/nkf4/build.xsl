<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xslthl="http://xslthl.sf.net"
                exclude-result-prefixes="xslthl">


    <xsl:import href="docbook-xsl/html/onechunk.xsl" />
    <xsl:import href="docbook-xsl/html/highlight.xsl" />

    <xsl:param name="html.stylesheet" select="'style.css'" />
    <xsl:param name="highlight.source" select="1" />
    <xsl:param name="highlight.default.language" select="'javascript'" />

    <xsl:template name="user.header.content">
        <script src="logic.js" type="text/javascript"></script>
    </xsl:template>

</xsl:stylesheet>
