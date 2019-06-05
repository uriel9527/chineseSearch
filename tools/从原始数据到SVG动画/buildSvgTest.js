const fs = require('fs')
const path = require('path')

const buildSvg = require('./buildSvg')


// 探索svg动画中的，animation-duration 和 stroke-dashoffset 与 笔画路径长度的关系。
const demo_data = [
  { length: 321.08990478515625, animationDuration: 0.7195638020833334, dashoffset: 577 },
  { length: 330.7146301269531, animationDuration: 0.7277018229166666, dashoffset: 587 },
  { length: 403.7048645019531, animationDuration: 0.787109375, dashoffset: 660 },
  { length: 465.853515625, animationDuration: 0.8375651041666666, dashoffset: 722 },
  { length: 914.2689819335938, animationDuration: 1.2021484375, dashoffset: 1170 },
  { length: 257.5745544433594, animationDuration: 0.6682942708333334, dashoffset: 514 }
]

const test_case = {
  "character": "永",
  "strokes": ["M 440 788 Q 497 731 535 718 Q 553 717 562 732 Q 569 748 564 767 Q 546 815 477 828 Q 438 841 421 834 Q 414 831 418 817 Q 421 804 440 788 Z", "M 532 448 Q 532 547 546 570 Q 559 589 546 601 Q 524 620 486 636 Q 462 645 413 615 Q 371 599 306 589 Q 290 588 299 578 Q 309 568 324 562 Q 343 558 370 565 Q 406 575 441 587 Q 460 594 467 584 Q 473 566 475 538 Q 482 271 470 110 Q 469 80 459 67 Q 453 61 369 82 Q 342 95 344 79 Q 411 27 450 -13 Q 463 -32 480 -38 Q 490 -42 499 -32 Q 541 16 540 77 Q 533 207 532 403 L 532 448 Z", "M 117 401 Q 104 401 102 392 Q 101 385 117 377 Q 163 352 192 363 Q 309 397 320 395 Q 333 392 323 365 Q 280 256 240 205 Q 200 147 126 86 Q 111 73 122 71 Q 132 70 153 80 Q 220 114 275 172 Q 327 224 394 362 Q 404 384 416 397 Q 431 409 422 419 Q 412 432 374 445 Q 353 455 305 434 Q 215 412 117 401 Z", "M 567 407 Q 639 452 745 526 Q 767 542 793 552 Q 817 562 806 582 Q 793 601 765 618 Q 740 634 725 632 Q 712 631 715 616 Q 719 582 641 505 Q 601 465 556 420 C 535 399 542 391 567 407 Z", "M 556 420 Q 543 436 532 448 C 512 470 515 427 532 403 Q 737 114 799 116 Q 871 126 933 135 Q 960 138 960 145 Q 961 152 930 165 Q 777 217 733 253 Q 678 296 567 407 L 556 420 Z"],
  "medians": [[[428, 824], [503, 781], [533, 756], [539, 741]], [[309, 579], [358, 580], [462, 613], [482, 608], [508, 581], [505, 121], [500, 59], [478, 24], [355, 78]], [[110, 391], [149, 384], [198, 387], [322, 418], [339, 417], [367, 402], [345, 333], [273, 208], [201, 129], [125, 78]], [[725, 621], [743, 596], [749, 578], [743, 570], [656, 489], [569, 421], [569, 415]], [[532, 441], [551, 399], [568, 378], [678, 259], [750, 194], [801, 163], [954, 145]]]
}

const test_case2 = {
  "character": "刚",
  "strokes": ["M 165 628 Q 164 627 168 620 Q 208 469 160 220 Q 133 118 144 90 Q 150 72 159 61 Q 172 46 182 61 Q 218 100 220 247 Q 226 524 238 602 C 241 626 241 626 225 639 Q 201 660 173 669 Q 163 670 156 662 Q 152 656 160 644 Q 163 637 165 628 Z", "M 238 602 Q 464 671 489 651 Q 502 644 506 585 Q 519 386 508 161 Q 508 127 495 118 Q 480 108 408 126 Q 392 127 394 119 Q 395 112 407 107 Q 471 64 506 29 Q 525 10 538 13 Q 550 16 560 43 Q 575 86 573 149 Q 549 590 569 631 Q 579 652 570 662 Q 560 677 515 698 Q 496 707 434 687 Q 334 660 225 639 C 196 633 209 593 238 602 Z", "M 395 363 Q 422 411 440 489 Q 447 511 456 535 Q 462 544 456 552 Q 449 559 421 571 Q 402 578 393 576 Q 383 572 385 558 Q 401 492 362 396 L 343 356 Q 306 293 234 215 Q 228 208 234 206 Q 259 202 337 280 Q 355 299 369 318 L 395 363 Z", "M 369 318 Q 453 203 455 201 Q 462 200 469 206 Q 479 213 476 249 Q 473 288 395 363 L 362 396 Q 305 450 271 477 Q 265 483 262 473 Q 259 463 266 454 Q 303 409 343 356 L 369 318 Z", "M 618 557 Q 648 497 627 324 Q 618 288 648 258 Q 657 248 666 258 Q 684 283 684 368 Q 684 488 689 529 Q 696 551 676 562 Q 660 572 643 580 Q 631 584 622 578 Q 615 572 618 557 Z", "M 788 687 Q 794 651 801 108 Q 801 86 789 76 Q 782 72 696 84 Q 659 94 663 84 Q 664 77 688 62 Q 764 11 784 -20 Q 809 -56 826 -56 Q 842 -57 856 -19 Q 872 30 868 110 Q 826 579 863 718 Q 881 751 820 774 Q 783 793 763 784 Q 744 777 762 753 Q 786 725 788 687 Z"],
  "medians": [[[166, 657], [184, 642], [203, 609], [208, 519], [201, 327], [171, 66]], [[234, 635], [252, 625], [274, 628], [357, 653], [482, 677], [512, 669], [534, 643], [542, 161], [536, 109], [521, 79], [487, 85], [402, 120]], [[398, 563], [421, 535], [411, 470], [384, 389], [355, 334], [317, 282], [237, 211]], [[270, 468], [423, 293], [456, 238], [461, 207]], [[631, 568], [656, 540], [659, 528], [653, 313], [657, 264]], [[770, 768], [788, 760], [823, 724], [820, 456], [834, 84], [813, 29], [669, 84]]]
}


const svg = buildSvg.buildSvg(test_case2)
fs.writeFile(path.join(__dirname, 'test.svg'), svg, () => console.log('done'))