import { useState, useEffect, useContext, createRef } from "react";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import TokenCard from "./TokenCard";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";

const TokenGridV4 = ({
  items,
  isDetail,
  onFinish,
  isLoading,
  listId,
  isMyProfile,
  openCardMenu,
  setOpenCardMenu,
  userHiddenItems,
  setUserHiddenItems,
  showUserHiddenItems,
  refreshItems,
  detailsModalCloseOnKeyChange,
  changeSpotlightItem,
}) => {
  const context = useContext(AppContext);
  const [itemsList, setItemsList] = useState([]);
  const [showDuplicateNFTs, setShowDuplicateNFTs] = useState({});
  const [itemsShowing, setItemsShowing] = useState(0);
  const deduplicatedItemsList = itemsList
    .filter((item) => {
      return showUserHiddenItems
        ? true
        : !userHiddenItems
        ? true
        : !userHiddenItems.includes(item.nft_id);
    })
    .filter((item) => {
      const hash = item?.token_img_url || item?.token_animation_url;
      return !item?.hidden_duplicate ? true : showDuplicateNFTs[hash];
    });
  const [hasMore, setHasMore] = useState(true);
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(null);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
      setCurrentlyPlayingVideo(null);
    }
  }, [escPress]);

  useEffect(() => {
    setCurrentlyOpenModal(null);
  }, [detailsModalCloseOnKeyChange]);

  const goToNext = () => {
    const currentIndex = deduplicatedItemsList.indexOf(currentlyOpenModal);
    if (currentIndex < deduplicatedItemsList.length - 1) {
      if (itemsShowing - 6 < currentIndex - 1) {
        fetchMoreData();
      }

      // Get position of next card image and scroll down
      const bodyRect = document.body.getBoundingClientRect();
      if (deduplicatedItemsList[currentIndex + 1].imageRef.current) {
        window.scrollTo({
          top:
            deduplicatedItemsList[
              currentIndex + 1
            ].imageRef.current.getBoundingClientRect().top -
            bodyRect.top -
            70,
          behavior: "smooth",
        });
      }

      setCurrentlyOpenModal(deduplicatedItemsList[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (rightPress && currentlyOpenModal) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
  }, [rightPress, itemsList]);

  const goToPrevious = () => {
    const currentIndex = deduplicatedItemsList.indexOf(currentlyOpenModal);
    if (currentIndex - 1 >= 0) {
      // Get position of previous card image and scroll up
      const bodyRect = document.body.getBoundingClientRect();
      if (deduplicatedItemsList[currentIndex - 1].imageRef.current) {
        window.scrollTo({
          top:
            deduplicatedItemsList[
              currentIndex - 1
            ].imageRef.current.getBoundingClientRect().top -
            bodyRect.top -
            70,
          behavior: "smooth",
        });
      }

      setCurrentlyOpenModal(deduplicatedItemsList[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (leftPress && currentlyOpenModal) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [leftPress, itemsList]);

  useEffect(() => {
    const validItems = items.filter(
      (item) =>
        (item.token_hidden !== 1 || isDetail) &&
        (item.token_img_url || item.token_animation_url)
    );
    const groupedItems = _.groupBy(
      validItems,
      (item) => item.token_img_url || item.token_animation_url
    );
    const uniqueItems = Object.values(groupedItems)
      .map((itemGroup) =>
        itemGroup.length > 1
          ? itemGroup.map((item, index) => ({
              ...item,
              hidden_duplicate: index !== 0,
              duplicate_count: itemGroup.length,
            }))
          : itemGroup[0]
      )
      .flat();
    const itemsWithRefs = [];
    _.forEach(uniqueItems, (item) => {
      item.imageRef = createRef();
      itemsWithRefs.push(item);
    });
    setItemsList(itemsWithRefs);
    setHasMore(true);
  }, [items]);

  useEffect(() => {
    if (context.isMobile) {
      setItemsShowing(4);
    } else {
      setItemsShowing(8);
    }
  }, [context.isMobile]);

  const fetchMoreData = () => {
    if (itemsShowing + 8 > itemsList.length) {
      setHasMore(false);
      onFinish ? onFinish() : null;
    }
    setItemsShowing(itemsShowing + 8);
  };

  const currentIndex = deduplicatedItemsList.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );

  if (!isLoading && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 mt-20 mb-24">
        <div>
          {" "}
          <FontAwesomeIcon style={{ height: 48, width: 48 }} icon={faThLarge} />
        </div>
        <div
          style={context.columns === 1 ? null : { width: context.gridWidth }}
          className="p-3 text-center"
        >
          No items found.
        </div>
      </div>
    );
  }
  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            columns={context.columns}
            hasNext={!(currentIndex === deduplicatedItemsList.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <InfiniteScroll
        dataLength={itemsShowing}
        next={fetchMoreData}
        hasMore={hasMore}
      >
        {isLoading ? (
          <div
            className="mx-auto items-center flex justify-center overflow-hidden py-4"
            style={context.columns === 1 ? null : { width: context.gridWidth }}
          >
            <div className="loading-card-spinner" />
          </div>
        ) : (
          <div
            className={`grid grid-cols-${context.columns} overflow-hidden ${
              context.isMobile ? "bg-gray-100" : ""
            }`}
            style={
              context.columns === 1
                ? null
                : {
                    width: context.gridWidth,
                  }
            }
          >
            {deduplicatedItemsList.slice(0, itemsShowing).map((item) => (
              <TokenCard
                key={item.nft_id}
                item={item}
                columns={context.columns}
                isMobile={context.isMobile}
                currentlyPlayingVideo={currentlyPlayingVideo}
                setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
                currentlyOpenModal={currentlyOpenModal}
                setCurrentlyOpenModal={setCurrentlyOpenModal}
                showDuplicateNFTs={showDuplicateNFTs}
                setShowDuplicateNFTs={setShowDuplicateNFTs}
                isMyProfile={isMyProfile}
                listId={listId}
                openCardMenu={openCardMenu}
                setOpenCardMenu={setOpenCardMenu}
                userHiddenItems={userHiddenItems}
                setUserHiddenItems={setUserHiddenItems}
                refreshItems={refreshItems}
                changeSpotlightItem={changeSpotlightItem}
              />
            ))}
          </div>
        )}
      </InfiniteScroll>
    </>
  );
};

export default TokenGridV4;
