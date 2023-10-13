/* eslint-disable react/display-name */

"use client";

import ExploreModelItemHeader from "../ExploreModelItemHeader";
import ModelVersionList from "../ModelVersionList";
import { Fragment, forwardRef, useEffect, useState } from "react";
import SimpleTag from "../SimpleTag";
import {
  MiscellanousTag,
  NumOfBit,
  QuantMethodTag,
  RamRequired,
  UsecaseTag,
  VersionTag,
} from "@/_components/SimpleTag/TagType";
import { displayDate } from "@/_utils/datetime";
import { Product } from "@/_models/Product";
import useGetMostSuitableModelVersion from "@/_hooks/useGetMostSuitableModelVersion";
import { toGigabytes } from "@/_utils/converter";

type Props = {
  model: Product;
};

const ExploreModelItem = forwardRef<HTMLDivElement, Props>(({ model }, ref) => {
  const [show, setShow] = useState(false);

  const { availableVersions } = model;
  const { suitableModel, getMostSuitableModelVersion } =
    useGetMostSuitableModelVersion();

  useEffect(() => {
    getMostSuitableModelVersion(availableVersions);
  }, [availableVersions]);

  if (!suitableModel) {
    return null;
  }

  const { quantMethod, bits, maxRamRequired, usecase } = suitableModel;

  return (
    <div
      ref={ref}
      className="flex flex-col border border-gray-200 rounded-md mb-4"
    >
      <ExploreModelItemHeader
        suitableModel={suitableModel}
        exploreModel={model}
      />
      <div className="flex flex-col px-[26px] py-[22px]">
        <div className="flex justify-between">
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-gray-500">
                Release Date
              </div>
              <div className="text-sm font-normal text-gray-900">
                {displayDate(model.releaseDate)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-500">Version</div>
              <div className="flex gap-2">
                <SimpleTag
                  title={model.version}
                  type={VersionTag.Version}
                  clickable={false}
                />
                <SimpleTag
                  title={quantMethod}
                  type={QuantMethodTag.Default}
                  clickable={false}
                />
                <SimpleTag
                  title={`${bits} Bits`}
                  type={NumOfBit.Default}
                  clickable={false}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <div className="text-sm font-medium text-gray-500">Author</div>
              <div className="text-sm font-normal text-gray-900">
                {model.author}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-500">
                Compatibility
              </div>
              <div className="flex gap-2">
                <SimpleTag
                  title={usecase}
                  type={UsecaseTag.UsecaseDefault}
                  clickable={false}
                />
                <SimpleTag
                  title={`${toGigabytes(maxRamRequired)} RAM required`}
                  type={RamRequired.RamDefault}
                  clickable={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[26px]">
          <span className="text-sm font-medium text-gray-500">About</span>
          <span className="text-sm font-normal text-gray-500">
            {model.longDescription}
          </span>
        </div>
        <div className="flex flex-col mt-5 gap-2">
          <span className="text-sm font-medium text-gray-500">Tags</span>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <SimpleTag
                key={tag}
                title={tag}
                type={MiscellanousTag.MiscellanousDefault}
                clickable={false}
              />
            ))}
          </div>
        </div>
      </div>
      {model.availableVersions?.length > 0 && (
        <Fragment>
          {show && (
            <ModelVersionList
              model={model}
              versions={model.availableVersions}
              recommendedVersion={suitableModel?.id ?? ""}
            />
          )}
          <button
            onClick={() => setShow(!show)}
            className="bg-[#FBFBFB] text-gray-500 text-sm text-left py-2 px-4 border-t border-gray-200"
          >
            {!show ? "+ Show Available Versions" : "- Collapse"}
          </button>
        </Fragment>
      )}
    </div>
  );
});

export default ExploreModelItem;