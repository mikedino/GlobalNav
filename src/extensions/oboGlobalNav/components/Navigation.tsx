import * as React from 'react';
import { DefaultButton, Icon } from '@fluentui/react';
import styles from '../GlobalNavStyles.module.scss';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'react-bootstrap';
//import SearchBoxCustom from './SearchComponent';
import { IGlobalNavCategory } from '../provider/dsDefinitions';
import SearchResultsList from './SearchList';
import { IGlobalNavProps } from './NavigationProps';

const GlobalNav: React.FC<IGlobalNavProps> = ({ isExpanded, categories, menuitems }) => {

    // State to set menu toggle status
    const [expanded, setExpanded] = React.useState<boolean>(isExpanded);
    // State to swap the menu icon 
    const [toggleIconName, setToggleIconName] = React.useState<string>("CollapseMenu");
    // State for breadcrumb & click menu
    //const [breadcrumb, setBreadcrumb] = React.useState<string[]>(["Organization"]); ///this was for a breadcrumb (using array)
    const [breadcrumb, setBreadcrumb] = React.useState<IGlobalNavCategory>(); ///this is for a string only (show Division)
    const [showClickMenu, setClickMenu] = React.useState<boolean>(false);
    // State for the click menu parent item id
    const [clickMenuParentID, setClickMenuParentID] = React.useState<number | null >(null);
    // State for holding the search term callback
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    // Handler for menu item click
    const menuSelect = (item: IGlobalNavCategory, reset: boolean): void => {
        // if this is a click on parent item, reset the breadcrumb/array and hide it
        if (reset) {
            setClickMenu(false);
        } else {
            setBreadcrumb(item);
            // once we have a second level click, show the breadcrumb
            setClickMenu(true);
            setClickMenuParentID(item.ID);
        }
    };

    // Use useEffect set default Click menu parent on component load (which is the first category)
    React.useEffect(() => {
        // Call menuSelect with the first item if categories are available
        if (categories.length > 0) {
            menuSelect(categories[0], true);
        }
        // Disable the warning for missing 'categories' in the dependency array because we only want this to run once on load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Toggle menu function
    const menuToggle = (): void => {
        setExpanded(!expanded);
        setToggleIconName(expanded ? "CollapseMenu" : "ChromeClose");
    };

    const handleDivClick = (url:string):void => {
        window.location.href = url;
    }

    return (
        <div id='OBOGlobalMenuContainer' className={styles.menu}>
            <div className={styles.category}>
                <div id="menu-icon" className={styles.menuIcon}>
                    <DefaultButton
                        iconProps={{ iconName: toggleIconName }}
                        title={expanded ? "Close OBO Global Menu" : "Open OBO Global Menu"}
                        className={styles.toggleButton}
                        onClick={menuToggle}
                    />
                </div>
                <div className={`${styles.globalMenu} ${expanded ? styles.change : ""}`} id="GlobalMenu" >
                    <SearchResultsList onSearchTermChange={(term) => setSearchTerm(term)} />
                    <div id='clickMenuContainer' className={`${styles.clickMenu} ${showClickMenu ? styles.toggle : ""}`}>
                        <div className={`${styles.menuTopRow} ${styles.mainMenuBack} accordion-button`} onClick={() => menuSelect(categories[0], true)}>
                            <Icon iconName='Back' className={styles.categoryIcon} about='Back to main menu' title='Back to main menu'></Icon>
                            Main Menu
                        </div>
                        {/* <div className={`${styles.menuTopRow} accordion-button`}>{breadcrumb.join(' > ')}</div> */}
                        <div className={`${styles.menuTopRow} ${styles.parentItem} accordion-button`} onClick={() => {
                            if (breadcrumb && breadcrumb.Url) handleDivClick(breadcrumb.Url)
                        }}>{breadcrumb?.Title}
                        </div>
                        <div className='clickMenuSubItemsContainer accordion-body'>
                            {menuitems.filter(item => item.Parent?.Id === clickMenuParentID)
                                .map(filteredItem =>
                                    <div key={filteredItem.ID}>
                                        <div className={`${styles.childItem} ${styles.linkOnly}`} onClick={() => handleDivClick(filteredItem.Url)}>
                                            <div>
                                                <a href={filteredItem.Url}>{filteredItem.Title}</a>
                                                {filteredItem.Restricted ? <Icon iconName='BlockedSite' about='Restricted Site' title='Restricted Site' className='ms-fontColor-alert'></Icon> : ""}
                                            </div>
                                        </div>
                                        {menuitems.filter(childItem => childItem.Parent?.Id === filteredItem.ID).map(childFilteredItem =>
                                            <div className={`${styles.childItem} ${styles.indent} ${styles.linkOnly}`} onClick={() => handleDivClick(filteredItem.Url)}>
                                                <div>
                                                    <a href={childFilteredItem.Url}>{childFilteredItem.Title}</a>
                                                    {childFilteredItem.Restricted ? <Icon iconName='BlockedSite' about='Restricted Site' title='Restricted Site' className='ms-fontColor-alert'></Icon> : ""}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {/* Conditionally render the accordionContainer based on searchTerm */}
                    {!searchTerm && (
                        <div id='accordionContainer' className={`${showClickMenu ? styles.accordionContainerHide : ""}`}>
                            <div className={`${styles.menuTopRow} accordion-button`}>
                                <div className={styles.menuHome}><Icon iconName='Home' className={styles.categoryIcon}></Icon>OBO Home</div>
                                <div className={styles.menuExpand}>{/* <Icon iconName='ExpandAll' className='mx-1'></Icon> */}</div>
                            </div>
                            <div>
                                {/* <Accordion defaultActiveKey='2' activeKey={activeKeys} onSelect={handleSelect} alwaysOpen> */}
                                <Accordion defaultActiveKey='2'>
                                    {categories.map(category =>
                                        <AccordionItem eventKey={category.ID.toString()}>
                                            <AccordionHeader onClick={() => menuSelect(category, true)}><Icon iconName={category.IconName} className={styles.categoryIcon}></Icon> {category.Title}</AccordionHeader>
                                            <AccordionBody>
                                                {menuitems.filter(item => item.Category.Id === category.ID && item.Parent?.Id === null)
                                                    .map(filteredItem => {

                                                        // Check if filteredItem.ID is also ParentID in the array (if it has children)
                                                        const hasChildren = menuitems.some(childItem => childItem.Parent?.Id === filteredItem.ID);

                                                        return (

                                                            <div key={filteredItem.ID} className={`${styles.childItem} ${hasChildren ? '' : styles.linkOnly}`} onClick={() => 
                                                                hasChildren ? menuSelect(filteredItem, false) : handleDivClick(filteredItem.Url)
                                                            }>
                                                                <div>
                                                                    <a href={filteredItem.Url}>{filteredItem.Title}</a>
                                                                    {filteredItem.Restricted ? <Icon iconName='BlockedSite' about='Restricted Site' title='Restricted Site' className='ms-fontColor-alert'></Icon> : ""}
                                                                </div>
                                                                {hasChildren ? <div className={styles.moreItemsIcon}>
                                                                    <Icon iconName='ChevronRight' about='See sub-sites' title='See sub-sites'></Icon>
                                                                </div> : ""}
                                                            </div>

                                                        );
                                                    })
                                                }
                                            </AccordionBody>
                                        </AccordionItem>
                                    )}
                                </Accordion>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalNav;