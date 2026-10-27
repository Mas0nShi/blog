import type * as types from 'notion-types'
import throttle from 'lodash.throttle'
import { getBlockParentPage, getBlockTitle, getBlockValue } from 'notion-utils'
import React from 'react'

import { NotionContextConsumer, NotionContextProvider } from '../context'
import { ClearIcon } from '../icons/clear-icon'
import { LoadingIcon } from '../icons/loading-icon'
import { SearchIcon } from '../icons/search-icon'
import { searchClassNames } from '../search'
import { PageTitle } from './page-title'

export class SearchDialog extends React.Component<{
  isOpen: boolean
  rootBlockId: string
  onClose: () => void
  searchNotion: (params: types.SearchParams) => Promise<types.SearchResults>
}> {
  constructor(props: {
    isOpen: boolean
    rootBlockId: string
    onClose: () => void
    searchNotion: (params: types.SearchParams) => Promise<types.SearchResults>
  }) {
    super(props)
    this._inputRef = React.createRef()
  }

  override state: {
    isLoading: boolean
    query: string
    searchResult: any
    searchError: types.APIError | null
  } = {
    isLoading: false,
    query: '',
    searchResult: null,
    searchError: null
  }

  _inputRef: any
  _search: any

  override componentDidMount() {
    this._search = throttle(this._searchImpl.bind(this), 1000)
    void this._warmupSearch()
  }

  override render() {
    const { isOpen, onClose } = this.props
    const { isLoading, query, searchResult, searchError } = this.state

    const hasQuery = !!query.trim()

    return (
      <NotionContextConsumer>
        {(ctx) => {
          const { components, defaultPageIcon, mapPageUrl } = ctx

          return (
            <components.Modal
              isOpen={isOpen}
              contentLabel='Search'
              className={searchClassNames.dialog}
              overlayClassName={searchClassNames.overlay}
              onRequestClose={onClose}
              onAfterOpen={this._onAfterOpen}
            >
              <div className={searchClassNames.menu}>
                <div className={searchClassNames.searchBar}>
                  <div className={searchClassNames.inlineIcon}>
                    {isLoading ? (
                      <LoadingIcon className={searchClassNames.loadingIcon} />
                    ) : (
                      <SearchIcon />
                    )}
                  </div>

                  <input
                    className={searchClassNames.input}
                    placeholder='Search'
                    value={query}
                    ref={this._inputRef}
                    onChange={this._onChangeQuery}
                  />

                  {query && (
                    <div
                      role='button'
                      className={searchClassNames.clearButton}
                      onClick={this._onClearQuery}
                    >
                      <ClearIcon className={searchClassNames.clearIcon} />
                    </div>
                  )}
                </div>

                {hasQuery && searchResult && (
                  <>
                    {searchResult.results.length ? (
                      <NotionContextProvider
                        {...ctx}
                        // TODO
                        recordMap={searchResult.recordMap}
                      >
                        <div className={searchClassNames.resultsPane}>
                          {searchResult.results.map((result: any) => (
                            <components.PageLink
                              key={result.id}
                              className={searchClassNames.result}
                              href={mapPageUrl(
                                result.page.id,
                                // TODO
                                searchResult.recordMap
                              )}
                            >
                              <PageTitle
                                className={searchClassNames.resultTitle}
                                block={result.page}
                                defaultIcon={defaultPageIcon}
                              />

                              {result.highlight?.html && (
                                <div
                                  className={searchClassNames.resultHighlight}
                                  dangerouslySetInnerHTML={{
                                    __html: result.highlight.html
                                  }}
                                />
                              )}
                            </components.PageLink>
                          ))}
                        </div>

                        <footer className={searchClassNames.footer}>
                          <div>
                            <span className={searchClassNames.count}>
                              {searchResult.total}
                            </span>

                            {searchResult.total === 1 ? ' result' : ' results'}
                          </div>
                        </footer>
                      </NotionContextProvider>
                    ) : (
                      <div className={searchClassNames.noResultsPane}>
                        <div className={searchClassNames.noResults}>
                          No results
                        </div>
                        <div className={searchClassNames.noResultsDetail}>
                          Try different search terms
                        </div>
                      </div>
                    )}
                  </>
                )}

                {hasQuery && !searchResult && searchError && (
                  <div className={searchClassNames.noResultsPane}>
                    <div className={searchClassNames.noResults}>
                      Search error
                    </div>
                  </div>
                )}
              </div>
            </components.Modal>
          )
        }}
      </NotionContextConsumer>
    )
  }

  _onAfterOpen = () => {
    if (this._inputRef.current) {
      this._inputRef.current.focus()
    }
  }

  _onChangeQuery = (e: any) => {
    const query = e.target.value
    this.setState({ query })

    if (!query.trim()) {
      this._search.cancel()
      this.setState({ isLoading: false, searchResult: null, searchError: null })
      return
    } else {
      // pass the query: state isn't updated yet when the throttled search
      // runs on the leading edge (e.g. when a query is pasted)
      this._search(query)
    }
  }

  _onClearQuery = () => {
    this._onChangeQuery({ target: { value: '' } })
  }

  _warmupSearch = async () => {
    const { searchNotion, rootBlockId } = this.props

    // search is generally implemented as a serverless function wrapping the notion
    // private API, upon opening the search dialog, so we eagerly invoke an empty
    // search in order to warm up the serverless lambda
    await searchNotion({
      query: '',
      ancestorId: rootBlockId
    })
  }

  _searchImpl = async (query: string) => {
    const { searchNotion, rootBlockId } = this.props

    if (!query.trim()) {
      this.setState({ isLoading: false, searchResult: null, searchError: null })
      return
    }

    this.setState({ isLoading: true })
    const result: any = await searchNotion({
      query,
      ancestorId: rootBlockId
    })

    let searchResult: any = null // TODO
    let searchError: types.APIError | null = null

    if (result.error || result.errorId) {
      searchError = result
    } else {
      searchResult = { ...result }

      const results = searchResult.results
        .map((result: any) => {
          const block = getBlockValue(searchResult.recordMap.block[result.id])
          if (!block) return

          const title = getBlockTitle(block, searchResult.recordMap)
          if (!title) {
            return
          }

          result.title = title
          result.block = block
          result.recordMap = searchResult.recordMap
          result.page =
            getBlockParentPage(block, searchResult.recordMap, {
              inclusive: true
            }) || block

          if (!result.page.id) {
            return
          }

          if (result.highlight?.text) {
            result.highlight.html = result.highlight.text
              .replaceAll(/<gzknfouu>/gi, '<b>')
              .replaceAll(/<\/gzknfouu>/gi, '</b>')
          }

          return result
        })
        .filter(Boolean)

      // dedupe results by page id
      const searchResultsMap = Object.fromEntries(
        results.map((result: any) => [result.page.id, result])
      )
      searchResult.results = Object.values(searchResultsMap)
    }

    if (this.state.query === query) {
      this.setState({ isLoading: false, searchResult, searchError })
    }
  }
}
