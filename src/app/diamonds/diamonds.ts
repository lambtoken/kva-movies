import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'Diamonds',
  templateUrl: './diamonds.html',
  imports: [NgStyle, NgForOf],
  styleUrls: ['./diamonds.css']
})
export class Diamonds implements OnInit {
  diamonds: any[] = [];

  ngOnInit() {
    const pageHeight = document.documentElement.scrollHeight;
    const count = Math.ceil(pageHeight / 100) * 3; // 3 per 100px height

    for (let i = 0; i < count; i++) {
      this.diamonds.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * pageHeight}px`,
        animationDuration: `${5 + Math.random() * 5}s`,
        animationDelay: `${Math.random() * 5}s`
      });
    }
    console.log(this.diamonds.length)
  }
}
