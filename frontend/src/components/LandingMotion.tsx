"use client";

import { useEffect } from "react";

export function LandingMotionLayer() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealSelector = "[data-landing-reveal]";

    if (reduceMotion || !("IntersectionObserver" in window)) {
      const revealTree = (node: Node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(revealSelector)) node.classList.add("is-visible");
        node.querySelectorAll<HTMLElement>(revealSelector).forEach((item) => item.classList.add("is-visible"));
      };

      revealTree(document.body);
      const mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => record.addedNodes.forEach(revealTree));
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const observedItems = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -7%" },
    );

    const observeTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      const candidates = [
        ...(node.matches(revealSelector) ? [node] : []),
        ...node.querySelectorAll<HTMLElement>(revealSelector),
      ];
      candidates.forEach((item) => {
        if (observedItems.has(item)) return;
        observedItems.add(item);
        observer.observe(item);
      });
    };

    observeTree(document.body);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeTree));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return <div className="landing-page-progress" aria-hidden="true" />;
}
