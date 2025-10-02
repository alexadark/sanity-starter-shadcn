export const linkQuery = `
    _key,
    ...,
    "href": select(
      isExternal => href,
      defined(href) && !defined(internalLink) => href,
      @.internalLink->slug.current == "index" => "/",
      @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
      @.internalLink->_type == "project" => "/projects/" + @.internalLink->slug.current,
      @.internalLink->_type == "projects-page" => "/projects",
      @.internalLink->_type == "category" => "/categories/" + @.internalLink->slug.current,
      "/" + @.internalLink->slug.current
    )
`;
